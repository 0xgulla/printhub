import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/files";

module {
  /// Maximum accepted upload size: 20 MB (20 * 1024 * 1024 bytes).
  public let maxUploadBytes : Nat = 20971520;

  /// Validate an upload's file name and size against the allowed extensions
  /// and the 20 MB limit.
  public func validateUpload(fileName : Text, sizeBytes : Nat) : Types.UploadValidation {
    if (sizeBytes == 0) {
      return #empty;
    };
    if (sizeBytes > maxUploadBytes) {
      return #tooLarge({ limitBytes = maxUploadBytes; actualBytes = sizeBytes });
    };
    switch (extensionOf(fileName)) {
      case (?ext) #ok(ext);
      case null #unsupportedExtension(extensionText(fileName));
    };
  };

  /// Register an uploaded file's metadata after its bytes are stored.
  public func registerFile(
    files : Map.Map<Common.FileId, Types.UploadedFile>,
    counters : { var nextFileId : Nat; var nextJobId : Nat },
    owner : Principal,
    fileName : Text,
    contentType : Text,
    sizeBytes : Nat,
    pageCount : Nat,
  ) : Types.UploadedFileView {
    let fileId = counters.nextFileId;
    counters.nextFileId := fileId + 1;
    let file : Types.UploadedFile = {
      id = fileId;
      owner;
      fileName;
      storedName = uniqueStoredName(fileId, fileName);
      contentType;
      sizeBytes;
      pageCount;
      uploadedAt = Time.now();
    };
    files.add(fileId, file);
    toView(file);
  };

  /// Fetch an uploaded file's metadata by id.
  public func getFile(files : Map.Map<Common.FileId, Types.UploadedFile>, fileId : Common.FileId) : ?Types.UploadedFileView {
    switch (files.get(fileId)) {
      case (?file) ?toView(file);
      case null null;
    };
  };

  /// List the caller's uploaded files, newest first.
  public func listFiles(files : Map.Map<Common.FileId, Types.UploadedFile>, owner : Principal) : [Types.UploadedFileView] {
    let owned = files.values()
      .filter(func file = Principal.equal(file.owner, owner))
      .map(toView)
      .toArray();
    owned.sort(func (a, b) = Nat.compare(b.id, a.id));
  };

  /// Convert an internal file record to its shared view.
  public func toView(file : Types.UploadedFile) : Types.UploadedFileView {
    {
      id = file.id;
      fileName = file.fileName;
      contentType = file.contentType;
      sizeBytes = file.sizeBytes;
      pageCount = file.pageCount;
      uploadedAt = file.uploadedAt;
    };
  };

  /// Build a unique stored name so two uploads of "notes.pdf" never collide.
  func uniqueStoredName(fileId : Common.FileId, fileName : Text) : Text {
    fileId.toText() # "-" # fileName;
  };

  /// Extract the lower-cased extension of a file name, if it is allowed.
  func extensionOf(fileName : Text) : ?Types.AllowedExtension {
    switch (extensionText(fileName)) {
      case ("pdf") ?#pdf;
      case ("jpg") ?#jpg;
      case ("jpeg") ?#jpeg;
      case ("png") ?#png;
      case ("doc") ?#doc;
      case ("docx") ?#docx;
      case (_) null;
    };
  };

  /// Lower-cased extension of a file name, or "" when there is none.
  func extensionText(fileName : Text) : Text {
    let parts = fileName.split(#char '.');
    var last = "";
    for (part in parts) {
      last := part;
    };
    last.toLower();
  };
};
