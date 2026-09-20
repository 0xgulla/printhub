import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  // Initial migration for the PrintHub backend.
  //
  // The previously deployed canister held no stable state (an empty actor),
  // so OldActor is the empty record. NewActor enumerates every stable field
  // declared in main.mo and supplies its initial value.
  type OldActor = {};

  type PaperSize = { #A4; #A3 };
  type ColorMode = { #BlackAndWhite; #Color };
  type PageSelection = { #All; #Custom };
  type JobStatus = {
    #Uploaded;
    #AwaitingPayment;
    #Paid;
    #SentToPrinter;
    #Printing;
    #Completed;
    #Cancelled;
    #Failed;
  };
  type PaymentStatus = { #NotStarted; #DemoPending; #DemoConfirmed };

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
    paymentStatus : PaymentStatus;
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

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      printers = Map.empty();
      files = Map.empty();
      analyses = Map.empty();
      jobs = Map.empty();
      counters = { var nextFileId = 1; var nextJobId = 1 };
    };
  };
};
