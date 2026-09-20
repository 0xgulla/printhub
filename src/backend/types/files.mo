import Common "common";

module {
  /// Metadata for an uploaded document. The bytes live in platform file
  /// storage and are never publicly exposed.
  public type UploadedFile = {
    id : Common.FileId;
    owner : Principal;
    fileName : Text;
    storedName : Text;
    contentType : Text;
    sizeBytes : Nat;
    pageCount : Nat;
    uploadedAt : Common.Timestamp;
  };

  /// Shared (serializable) view of an uploaded file.
  public type UploadedFileView = {
    id : Common.FileId;
    fileName : Text;
    contentType : Text;
    sizeBytes : Nat;
    pageCount : Nat;
    uploadedAt : Common.Timestamp;
  };

  /// Accepted upload extensions.
  public type AllowedExtension = {
    #pdf;
    #jpg;
    #jpeg;
    #png;
    #doc;
    #docx;
  };

  /// Validation outcome for an upload attempt.
  public type UploadValidation = {
    #ok : AllowedExtension;
    #unsupportedExtension : Text;
    #tooLarge : { limitBytes : Nat; actualBytes : Nat };
    #empty;
  };
};
