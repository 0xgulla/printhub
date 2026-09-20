import Common "common";

module {
  /// Print options chosen by the user for a job.
  public type PrintOptions = {
    colorMode : Common.ColorMode;
    copies : Nat;
    paperSize : Common.PaperSize;
    pageSelection : Common.PageSelection;
    customRange : ?Text;
    excludedBlankPages : [Nat];
  };

  /// A print job tracked by PrintHub.
  ///
  /// `pageCount` is the number of pages actually sent to the printer: the
  /// document's real page count minus the pages excluded from printing.
  public type PrintJob = {
    id : Common.JobId;
    jobRef : Common.JobRef;
    owner : Principal;
    fileId : Common.FileId;
    fileName : Text;
    pageCount : Nat;
    sizeBytes : Nat;
    options : PrintOptions;
    estimatedPrice : Nat;
    printerId : Common.PrinterId;
    status : Common.JobStatus;
    printedPages : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  /// Shared (serializable) view of a print job.
  public type PrintJobView = {
    id : Common.JobId;
    jobRef : Common.JobRef;
    fileId : Common.FileId;
    fileName : Text;
    pageCount : Nat;
    sizeBytes : Nat;
    options : PrintOptions;
    estimatedPrice : Nat;
    printerId : Common.PrinterId;
    status : Common.JobStatus;
    printedPages : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  /// Simulated progress of an in-flight print job.
  public type PrintProgress = {
    jobId : Common.JobId;
    printedPages : Nat;
    totalPages : Nat;
    status : Common.JobStatus;
    updatedAt : Common.Timestamp;
  };

  /// Aggregate statistics for the user dashboard.
  public type UserStats = {
    totalPrints : Nat;
    totalSpent : Nat;
    savedFiles : Nat;
  };

  /// Aggregate statistics for the admin / printer-owner dashboard.
  public type AdminStats = {
    totalPrints : Nat;
    revenue : Nat;
    onlineDevices : Nat;
    offlineDevices : Nat;
  };
};
