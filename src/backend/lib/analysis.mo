import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/analysis";

module {
  /// Persist a real per-page analysis result for an uploaded file.
  ///
  /// The page arrays are computed from the actual PDF content by the client
  /// (pdf.js) and submitted here. The backend validates them against the
  /// document's real page count, derives the printable page count and the
  /// human-readable notes, and stores the result verbatim.
  public func analyzeFile(
    analyses : Map.Map<Common.FileId, Types.AnalysisResult>,
    fileId : Common.FileId,
    input : Types.PageAnalysisInput,
  ) : Types.AnalysisResult {
    let totalPages = input.totalPages;
    let blankPages = validPages(input.blankPages, totalPages);
    let nearlyBlankPages = validPages(input.nearlyBlankPages, totalPages);
    let lowContentPages = validPages(input.lowContentPages, totalPages);
    let colorPages = validPages(input.colorPages, totalPages);
    let blankCount = blankPages.size();
    let contentPageCount = nonNegativeDifference(totalPages, blankCount);
    let result : Types.AnalysisResult = {
      fileId;
      totalPages;
      blankPages;
      nearlyBlankPages;
      lowContentPages;
      colorPages;
      contentPageCount;
      issueNotes = issueNotes(blankPages, nearlyBlankPages, lowContentPages, colorPages, totalPages);
      analyzedAt = Time.now();
    };
    analyses.add(fileId, result);
    result;
  };

  /// Fetch a stored analysis result for a file.
  public func getAnalysis(analyses : Map.Map<Common.FileId, Types.AnalysisResult>, fileId : Common.FileId) : ?Types.AnalysisResultView {
    switch (analyses.get(fileId)) {
      case (?result) ?toView(result);
      case null null;
    };
  };

  /// Convert an internal analysis record to its shared view.
  public func toView(result : Types.AnalysisResult) : Types.AnalysisResultView {
    {
      fileId = result.fileId;
      totalPages = result.totalPages;
      blankPages = result.blankPages;
      nearlyBlankPages = result.nearlyBlankPages;
      lowContentPages = result.lowContentPages;
      colorPages = result.colorPages;
      contentPageCount = result.contentPageCount;
      issueNotes = result.issueNotes;
      analyzedAt = result.analyzedAt;
    };
  };

  /// `total - part`, clamped at 0 so the subtraction can never trap.
  func nonNegativeDifference(total : Nat, part : Nat) : Nat {
    if (part >= total) { 0 } else { total - part };
  };

  /// Keep only the 1-based page numbers that fall within 1..totalPages,
  /// de-duplicated and in ascending order.
  func validPages(pages : [Nat], totalPages : Nat) : [Nat] {
    let kept = List.empty<Nat>();
    for (page in pages.values()) {
      if (page >= 1 and page <= totalPages and not kept.contains(page)) {
        kept.add(page);
      };
    };
    kept.toArray().sort(func (a, b) = Nat.compare(a, b));
  };

  /// Human-readable notes describing what the analysis found.
  func issueNotes(
    blankPages : [Nat],
    nearlyBlankPages : [Nat],
    lowContentPages : [Nat],
    colorPages : [Nat],
    totalPages : Nat,
  ) : [Text] {
    let notes = List.empty<Text>();
    if (blankPages.size() > 0) {
      notes.add(blankPages.size().toText() # " blank pages detected. You can save paper by excluding them.");
    } else {
      notes.add("No blank pages detected.");
    };
    if (nearlyBlankPages.size() > 0) {
      notes.add(nearlyBlankPages.size().toText() # " nearly blank pages may print with very little ink.");
    };
    if (lowContentPages.size() > 0) {
      notes.add(lowContentPages.size().toText() # " pages have very little content.");
    };
    if (colorPages.size() > 0) {
      notes.add(colorPages.size().toText() # " colour pages detected out of " # totalPages.toText() # " pages.");
    } else {
      notes.add("All pages are black and white.");
    };
    notes.toArray();
  };
};
