import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Common "../types/common";
import AnalysisTypes "../types/analysis";
import FileTypes "../types/files";
import PrinterTypes "../types/printers";
import Types "../types/jobs";

module {
  /// Base price per page in rupees, before colour / paper / copy multipliers.
  let basePricePerPage : Nat = 1;

  /// The PrintHub portable device that every job is routed through. The user
  /// never chooses a printer; the system always uses this device.
  public let portableDeviceId : Common.PrinterId = "PH-001";

  /// Compute the estimated price for a job from its options.
  ///
  /// Default example: 12 pages, black & white, 1 copy, A4 -> 12.
  public func estimatePrice(pageCount : Nat, options : Types.PrintOptions) : Nat {
    let billedPages = billedPageCount(pageCount, options);
    let perPage = switch (options.colorMode) {
      case (#BlackAndWhite) basePricePerPage;
      case (#Color) basePricePerPage * 5;
    };
    let paperMultiplier = switch (options.paperSize) {
      case (#A4) 1;
      case (#A3) 2;
    };
    billedPages * perPage * paperMultiplier * options.copies;
  };

  /// Create a print job and start printing immediately.
  ///
  /// There is no payment step: the job is created in the `#Printing` state and
  /// routed through the PrintHub portable device. `pageCount` is the number of
  /// pages actually sent to the printer, derived from the file's real page
  /// count minus the pages excluded from printing.
  public func createJob(
    jobs : Map.Map<Common.JobId, Types.PrintJob>,
    counters : { var nextFileId : Nat; var nextJobId : Nat },
    owner : Principal,
    file : FileTypes.UploadedFile,
    options : Types.PrintOptions,
  ) : Types.PrintJobView {
    let jobId = counters.nextJobId;
    counters.nextJobId := jobId + 1;
    let now = Time.now();
    let printablePages = printablePageCount(file.pageCount, options);
    let job : Types.PrintJob = {
      id = jobId;
      jobRef = jobRef(jobId);
      owner;
      fileId = file.id;
      fileName = file.fileName;
      pageCount = printablePages;
      sizeBytes = file.sizeBytes;
      options;
      estimatedPrice = estimatePrice(file.pageCount, options);
      printerId = portableDeviceId;
      status = #Printing;
      printedPages = 0;
      createdAt = now;
      updatedAt = now;
    };
    jobs.add(jobId, job);
    toView(job);
  };

  /// Fetch a print job by id.
  public func getJob(jobs : Map.Map<Common.JobId, Types.PrintJob>, jobId : Common.JobId) : ?Types.PrintJobView {
    switch (jobs.get(jobId)) {
      case (?job) ?toView(job);
      case null null;
    };
  };

  /// List the caller's print jobs, newest first.
  public func listJobs(jobs : Map.Map<Common.JobId, Types.PrintJob>, owner : Principal) : [Types.PrintJobView] {
    let owned = jobs.values()
      .filter(func job = Principal.equal(job.owner, owner))
      .map(toView)
      .toArray();
    owned.sort(func (a, b) = Nat.compare(b.id, a.id));
  };

  /// Read the simulated progress of a job.
  public func getPrintProgress(jobs : Map.Map<Common.JobId, Types.PrintJob>, jobId : Common.JobId) : ?Types.PrintProgress {
    switch (jobs.get(jobId)) {
      case (?job) {
        ?{
          jobId = job.id;
          printedPages = job.printedPages;
          totalPages = billedPageCount(job.pageCount, job.options);
          status = job.status;
          updatedAt = job.updatedAt;
        };
      };
      case null null;
    };
  };

  /// Cancel a job that has not completed.
  public func cancelJob(jobs : Map.Map<Common.JobId, Types.PrintJob>, jobId : Common.JobId) : Types.PrintJobView {
    let job = jobs.get(jobId) ?? Runtime.trap("Unknown job id");
    if (job.status == #Completed) {
      Runtime.trap("Completed jobs cannot be cancelled");
    };
    if (job.status == #Cancelled) {
      Runtime.trap("Job is already cancelled");
    };
    let updated : Types.PrintJob = {
      id = job.id;
      jobRef = job.jobRef;
      owner = job.owner;
      fileId = job.fileId;
      fileName = job.fileName;
      pageCount = job.pageCount;
      sizeBytes = job.sizeBytes;
      options = job.options;
      estimatedPrice = job.estimatedPrice;
      printerId = job.printerId;
      status = #Cancelled;
      printedPages = job.printedPages;
      createdAt = job.createdAt;
      updatedAt = Time.now();
    };
    jobs.add(jobId, updated);
    toView(updated);
  };

  /// Advance simulated printing for all in-flight jobs by a page or two.
  public func tickPrinting(jobs : Map.Map<Common.JobId, Types.PrintJob>) : () {
    for ((jobId, job) in jobs.entries()) {
      if (job.status == #Printing) {
        let total = billedPageCount(job.pageCount, job.options);
        let step = if (total > 20) 2 else 1;
        let next = Nat.min(job.printedPages + step, total);
        let completed = next >= total;
        let updated : Types.PrintJob = {
          id = job.id;
          jobRef = job.jobRef;
          owner = job.owner;
          fileId = job.fileId;
          fileName = job.fileName;
          pageCount = job.pageCount;
          sizeBytes = job.sizeBytes;
          options = job.options;
          estimatedPrice = job.estimatedPrice;
          printerId = job.printerId;
          status = if (completed) #Completed else #Printing;
          printedPages = next;
          createdAt = job.createdAt;
          updatedAt = Time.now();
        };
        jobs.add(jobId, updated);
      };
    };
  };

  /// Aggregate statistics for one user.
  public func getUserStats(
    jobs : Map.Map<Common.JobId, Types.PrintJob>,
    files : Map.Map<Common.FileId, FileTypes.UploadedFile>,
    owner : Principal,
  ) : Types.UserStats {
    var totalPrints = 0;
    var totalSpent = 0;
    for (job in jobs.values()) {
      if (Principal.equal(job.owner, owner) and job.status == #Completed) {
        totalPrints += 1;
        totalSpent += job.estimatedPrice;
      };
    };
    var savedFiles = 0;
    for (file in files.values()) {
      if (Principal.equal(file.owner, owner)) {
        savedFiles += 1;
      };
    };
    { totalPrints; totalSpent; savedFiles };
  };

  /// Aggregate statistics for the admin dashboard.
  public func getAdminStats(
    jobs : Map.Map<Common.JobId, Types.PrintJob>,
    printers : Map.Map<Common.PrinterId, PrinterTypes.Printer>,
  ) : Types.AdminStats {
    var totalPrints = 0;
    var revenue = 0;
    for (job in jobs.values()) {
      if (job.status == #Completed) {
        totalPrints += 1;
        revenue += job.estimatedPrice;
      };
    };
    var onlineDevices = 0;
    var offlineDevices = 0;
    for (printer in printers.values()) {
      if (printer.isOnline) {
        onlineDevices += 1;
      } else {
        offlineDevices += 1;
      };
    };
    { totalPrints; revenue; onlineDevices; offlineDevices };
  };

  /// Convert an internal job record to its shared view.
  public func toView(job : Types.PrintJob) : Types.PrintJobView {
    {
      id = job.id;
      jobRef = job.jobRef;
      fileId = job.fileId;
      fileName = job.fileName;
      pageCount = job.pageCount;
      sizeBytes = job.sizeBytes;
      options = job.options;
      estimatedPrice = job.estimatedPrice;
      printerId = job.printerId;
      status = job.status;
      printedPages = job.printedPages;
      createdAt = job.createdAt;
      updatedAt = job.updatedAt;
    };
  };

  /// Pages actually sent to the printer: the document's real page count minus
  /// the pages excluded from printing.
  public func printablePageCount(pageCount : Nat, options : Types.PrintOptions) : Nat {
    nonNegativeDifference(pageCount, options.excludedBlankPages.size());
  };

  /// Pages actually billed: the printable page count multiplied by copies.
  func billedPageCount(pageCount : Nat, options : Types.PrintOptions) : Nat {
    printablePageCount(pageCount, options) * options.copies;
  };

  /// `total - part`, clamped at 0 so the subtraction can never trap.
  func nonNegativeDifference(total : Nat, part : Nat) : Nat {
    if (part >= total) { 0 } else { total - part };
  };

  /// Human-facing job reference, e.g. "PH10245".
  func jobRef(jobId : Common.JobId) : Common.JobRef {
    "PH" # (10000 + jobId).toText();
  };
};
