module {
  /// Cross-cutting identifiers and primitives shared across PrintHub domains.

  /// Stable numeric identifier for a print job.
  public type JobId = Nat;

  /// Stable identifier for a printer device, e.g. "PH-001".
  public type PrinterId = Text;

  /// Stable identifier for an uploaded file record.
  public type FileId = Nat;

  /// Nanosecond timestamp (Time.now()).
  public type Timestamp = Int;

  /// Human-facing job reference, e.g. "PH10245".
  public type JobRef = Text;

  /// Paper size supported by a printer or chosen for a job.
  public type PaperSize = {
    #A4;
    #A3;
  };

  /// Color mode chosen for a job.
  public type ColorMode = {
    #BlackAndWhite;
    #Color;
  };

  /// Lifecycle state of a print job.
  ///
  /// A job created from Customize Printing goes straight to `#Printing`; there
  /// is no payment state in the workflow.
  public type JobStatus = {
    #Uploaded;
    #Printing;
    #Completed;
    #Cancelled;
    #Failed;
  };

  /// Page selection for a job.
  public type PageSelection = {
    #All;
    #Custom;
  };
};
