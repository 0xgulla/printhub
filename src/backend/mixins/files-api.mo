import Map "mo:core/Map";
import Common "../types/common";
import FileTypes "../types/files";
import FilesLib "../lib/files";

mixin (
  files : Map.Map<Common.FileId, FileTypes.UploadedFile>,
  counters : { var nextFileId : Nat; var nextJobId : Nat },
) {
  /// Validate an upload's file name and size before its bytes are stored.
  public query func validateUpload(fileName : Text, sizeBytes : Nat) : async FileTypes.UploadValidation {
    FilesLib.validateUpload(fileName, sizeBytes);
  };

  /// Register an uploaded file's metadata after its bytes are stored.
  public shared ({ caller }) func registerFile(
    fileName : Text,
    contentType : Text,
    sizeBytes : Nat,
    pageCount : Nat,
  ) : async FileTypes.UploadedFileView {
    FilesLib.registerFile(files, counters, caller, fileName, contentType, sizeBytes, pageCount);
  };

  /// Fetch an uploaded file's metadata by id.
  public query func getFile(fileId : Nat) : async ?FileTypes.UploadedFileView {
    FilesLib.getFile(files, fileId);
  };

  /// List the caller's uploaded files.
  public query ({ caller }) func listFiles() : async [FileTypes.UploadedFileView] {
    FilesLib.listFiles(files, caller);
  };
};
