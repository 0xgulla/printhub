import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import AnalysisTypes "../types/analysis";
import FileTypes "../types/files";
import AnalysisLib "../lib/analysis";

mixin (
  analyses : Map.Map<Common.FileId, AnalysisTypes.AnalysisResult>,
  files : Map.Map<Common.FileId, FileTypes.UploadedFile>,
) {
  /// Persist the real per-page analysis for an uploaded file.
  ///
  /// The page arrays are computed from the actual PDF content by the client
  /// (pdf.js) and submitted here; the backend validates them against the
  /// document's real page count and stores the result.
  public shared ({ caller }) func analyzeFile(
    fileId : Nat,
    input : AnalysisTypes.PageAnalysisInput,
  ) : async AnalysisTypes.AnalysisResultView {
    let file = files.get(fileId) ?? Runtime.trap("Unknown file id");
    if (not Principal.equal(file.owner, caller)) {
      Runtime.trap("File does not belong to the caller");
    };
    if (input.totalPages != file.pageCount) {
      Runtime.trap("Analysis page count does not match the uploaded file");
    };
    AnalysisLib.toView(AnalysisLib.analyzeFile(analyses, fileId, input));
  };

  /// Fetch a stored analysis result for a file.
  public query func getAnalysis(fileId : Nat) : async ?AnalysisTypes.AnalysisResultView {
    AnalysisLib.getAnalysis(analyses, fileId);
  };
};
