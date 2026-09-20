import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import FileTypes "../types/files";
import JobTypes "../types/jobs";
import PrinterTypes "../types/printers";
import JobsLib "../lib/jobs";

mixin (
  jobs : Map.Map<Common.JobId, JobTypes.PrintJob>,
  files : Map.Map<Common.FileId, FileTypes.UploadedFile>,
  printers : Map.Map<Common.PrinterId, PrinterTypes.Printer>,
  counters : { var nextFileId : Nat; var nextJobId : Nat },
  accessControlState : AccessControl.AccessControlState,
) {
  /// Compute the estimated price for a job from its options.
  public query func estimatePrice(
    pageCount : Nat,
    options : JobTypes.PrintOptions,
  ) : async Nat {
    JobsLib.estimatePrice(pageCount, options);
  };

  /// Create a print job and start printing immediately.
  ///
  /// There is no payment step and no printer selection: the job is routed
  /// through the PrintHub portable device automatically.
  public shared ({ caller }) func createJob(
    fileId : Nat,
    options : JobTypes.PrintOptions,
  ) : async JobTypes.PrintJobView {
    if (options.copies == 0) {
      Runtime.trap("Copies must be at least 1");
    };
    let file = files.get(fileId) ?? Runtime.trap("Unknown file id");
    if (not Principal.equal(file.owner, caller)) {
      Runtime.trap("File does not belong to the caller");
    };
    JobsLib.createJob(jobs, counters, caller, file, options);
  };

  /// Fetch a print job by id.
  public query func getJob(jobId : Common.JobId) : async ?JobTypes.PrintJobView {
    JobsLib.getJob(jobs, jobId);
  };

  /// List the caller's print jobs, newest first.
  public query ({ caller }) func listJobs() : async [JobTypes.PrintJobView] {
    JobsLib.listJobs(jobs, caller);
  };

  /// Read the simulated progress of a job.
  public query func getPrintProgress(jobId : Common.JobId) : async ?JobTypes.PrintProgress {
    JobsLib.getPrintProgress(jobs, jobId);
  };

  /// Cancel a job that has not completed.
  public shared ({ caller }) func cancelJob(jobId : Common.JobId) : async JobTypes.PrintJobView {
    requireOwnJob(jobId, caller);
    JobsLib.cancelJob(jobs, jobId);
  };

  /// Advance simulated printing for all in-flight jobs.
  public shared func tickPrinting() : async () {
    JobsLib.tickPrinting(jobs);
  };

  /// Aggregate statistics for the caller's dashboard.
  public query ({ caller }) func getUserStats() : async JobTypes.UserStats {
    JobsLib.getUserStats(jobs, files, caller);
  };

  /// Aggregate statistics for the admin dashboard. Admin-only.
  public query ({ caller }) func getAdminStats() : async JobTypes.AdminStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view admin statistics");
    };
    JobsLib.getAdminStats(jobs, printers);
  };

  /// Reject a job id that does not exist or is not owned by the caller.
  func requireOwnJob(jobId : Common.JobId, caller : Principal) : () {
    let job = jobs.get(jobId) ?? Runtime.trap("Unknown job id");
    if (not Principal.equal(job.owner, caller)) {
      Runtime.trap("Job does not belong to the caller");
    };
  };
};
