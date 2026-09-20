import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // PrintHub workflow migration: remove the payment step and store real
  // per-page analysis results.
  //
  // OldActor mirrors the previously deployed stable signature (the NewActor of
  // 20260919_000000). NewActor drops `paymentStatus` from every job, narrows
  // JobStatus to the payment-free lifecycle, and adds `colorPages` to every
  // analysis result.
  type OldActor = {
    accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, { #admin; #user; #guest }>;
    };
    printers : Map.Map<Text, OldPrinter>;
    files : Map.Map<Nat, OldUploadedFile>;
    analyses : Map.Map<Nat, OldAnalysisResult>;
    jobs : Map.Map<Nat, OldPrintJob>;
    counters : { var nextFileId : Nat; var nextJobId : Nat };
  };

  type OldPaperSize = { #A4; #A3 };
  type OldColorMode = { #BlackAndWhite; #Color };
  type OldPageSelection = { #All; #Custom };
  type OldJobStatus = {
    #Uploaded;
    #AwaitingPayment;
    #Paid;
    #SentToPrinter;
    #Printing;
    #Completed;
    #Cancelled;
    #Failed;
  };
  type OldPaymentStatus = { #NotStarted; #DemoPending; #DemoConfirmed };

  type OldPrinter = {
    id : Text;
    name : Text;
    location : Text;
    paperSizes : [OldPaperSize];
    colorModes : [OldColorMode];
    isOnline : Bool;
    openingHours : Text;
    rating : Nat;
    speedPagesPerMinute : Nat;
    description : Text;
  };

  type OldUploadedFile = {
    id : Nat;
    owner : Principal;
    fileName : Text;
    storedName : Text;
    contentType : Text;
    sizeBytes : Nat;
    pageCount : Nat;
    uploadedAt : Int;
  };

  type OldAnalysisResult = {
    fileId : Nat;
    totalPages : Nat;
    blankPages : [Nat];
    nearlyBlankPages : [Nat];
    lowContentPages : [Nat];
    contentPageCount : Nat;
    issueNotes : [Text];
    analyzedAt : Int;
  };

  type OldPrintOptions = {
    colorMode : OldColorMode;
    copies : Nat;
    paperSize : OldPaperSize;
    pageSelection : OldPageSelection;
    customRange : ?Text;
    excludedBlankPages : [Nat];
  };

  type OldPrintJob = {
    id : Nat;
    jobRef : Text;
    owner : Principal;
    fileId : Nat;
    fileName : Text;
    pageCount : Nat;
    sizeBytes : Nat;
    options : OldPrintOptions;
    estimatedPrice : Nat;
    printerId : Text;
    status : OldJobStatus;
    paymentStatus : OldPaymentStatus;
    printedPages : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  type PaperSize = { #A4; #A3 };
  type ColorMode = { #BlackAndWhite; #Color };
  type PageSelection = { #All; #Custom };
  type JobStatus = {
    #Uploaded;
    #Printing;
    #Completed;
    #Cancelled;
    #Failed;
  };

  type Printer = {
    id : Text;
    name : Text;
    location : Text;
    paperSizes : [PaperSize];
    colorModes : [ColorMode];
    isOnline : Bool;
    openingHours : Text;
    rating : Nat;
    speedPagesPerMinute : Nat;
    description : Text;
  };

  type UploadedFile = {
    id : Nat;
    owner : Principal;
    fileName : Text;
    storedName : Text;
    contentType : Text;
    sizeBytes : Nat;
    pageCount : Nat;
    uploadedAt : Int;
  };

  type AnalysisResult = {
    fileId : Nat;
    totalPages : Nat;
    blankPages : [Nat];
    nearlyBlankPages : [Nat];
    lowContentPages : [Nat];
    colorPages : [Nat];
    contentPageCount : Nat;
    issueNotes : [Text];
    analyzedAt : Int;
  };

  type PrintOptions = {
    colorMode : ColorMode;
    copies : Nat;
    paperSize : PaperSize;
    pageSelection : PageSelection;
    customRange : ?Text;
    excludedBlankPages : [Nat];
  };

  type PrintJob = {
    id : Nat;
    jobRef : Text;
    owner : Principal;
    fileId : Nat;
    fileName : Text;
    pageCount : Nat;
    sizeBytes : Nat;
    options : PrintOptions;
    estimatedPrice : Nat;
    printerId : Text;
    status : JobStatus;
    printedPages : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  type NewActor = {
    accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, { #admin; #user; #guest }>;
    };
    printers : Map.Map<Text, Printer>;
    files : Map.Map<Nat, UploadedFile>;
    analyses : Map.Map<Nat, AnalysisResult>;
    jobs : Map.Map<Nat, PrintJob>;
    counters : { var nextFileId : Nat; var nextJobId : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      printers = old.printers.map(
        func(_, printer) {
          {
            id = printer.id;
            name = printer.name;
            location = printer.location;
            paperSizes = printer.paperSizes;
            colorModes = printer.colorModes;
            isOnline = printer.isOnline;
            openingHours = printer.openingHours;
            rating = printer.rating;
            speedPagesPerMinute = printer.speedPagesPerMinute;
            description = printer.description;
          };
        }
      );
      files = old.files.map(
        func(_, file) {
          {
            id = file.id;
            owner = file.owner;
            fileName = file.fileName;
            storedName = file.storedName;
            contentType = file.contentType;
            sizeBytes = file.sizeBytes;
            pageCount = file.pageCount;
            uploadedAt = file.uploadedAt;
          };
        }
      );
      analyses = old.analyses.map(
        func(_, analysis) {
          {
            fileId = analysis.fileId;
            totalPages = analysis.totalPages;
            blankPages = analysis.blankPages;
            nearlyBlankPages = analysis.nearlyBlankPages;
            lowContentPages = analysis.lowContentPages;
            colorPages = [];
            contentPageCount = analysis.contentPageCount;
            issueNotes = analysis.issueNotes;
            analyzedAt = analysis.analyzedAt;
          };
        }
      );
      jobs = old.jobs.map(
        func(_, job) {
          {
            id = job.id;
            jobRef = job.jobRef;
            owner = job.owner;
            fileId = job.fileId;
            fileName = job.fileName;
            pageCount = job.pageCount;
            sizeBytes = job.sizeBytes;
            options = {
              colorMode = job.options.colorMode;
              copies = job.options.copies;
              paperSize = job.options.paperSize;
              pageSelection = job.options.pageSelection;
              customRange = job.options.customRange;
              excludedBlankPages = job.options.excludedBlankPages;
            };
            estimatedPrice = job.estimatedPrice;
            printerId = job.printerId;
            status = switch (job.status) {
              case (#Uploaded) { #Uploaded };
              case (#AwaitingPayment) { #Uploaded };
              case (#Paid) { #Uploaded };
              case (#SentToPrinter) { #Printing };
              case (#Printing) { #Printing };
              case (#Completed) { #Completed };
              case (#Cancelled) { #Cancelled };
              case (#Failed) { #Failed };
            };
            printedPages = job.printedPages;
            createdAt = job.createdAt;
            updatedAt = job.updatedAt;
          };
        }
      );
      counters = old.counters;
    };
  };
};
