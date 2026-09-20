import Common "common";

module {
  /// Result of the PrintHub AI document analysis for one uploaded file.
  ///
  /// The page arrays are computed from the real PDF content by the frontend
  /// (pdf.js) and submitted to the backend, which persists them verbatim.
  public type AnalysisResult = {
    fileId : Common.FileId;
    totalPages : Nat;
    blankPages : [Nat];
    nearlyBlankPages : [Nat];
    lowContentPages : [Nat];
    colorPages : [Nat];
    contentPageCount : Nat;
    issueNotes : [Text];
    analyzedAt : Common.Timestamp;
  };

  /// Shared (serializable) view of an analysis result.
  public type AnalysisResultView = {
    fileId : Common.FileId;
    totalPages : Nat;
    blankPages : [Nat];
    nearlyBlankPages : [Nat];
    lowContentPages : [Nat];
    colorPages : [Nat];
    contentPageCount : Nat;
    issueNotes : [Text];
    analyzedAt : Common.Timestamp;
  };

  /// Per-page analysis submitted by the client after inspecting the real PDF.
  ///
  /// `blankPages`, `nearlyBlankPages`, `lowContentPages` and `colorPages` hold
  /// 1-based page numbers. `totalPages` is the real page count of the document.
  public type PageAnalysisInput = {
    totalPages : Nat;
    blankPages : [Nat];
    nearlyBlankPages : [Nat];
    lowContentPages : [Nat];
    colorPages : [Nat];
  };
};
