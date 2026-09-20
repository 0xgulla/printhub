import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import JobStatusValue "JobStatusValue";
import Common "types/common";
import PrinterTypes "types/printers";
import FileTypes "types/files";
import AnalysisTypes "types/analysis";
import JobTypes "types/jobs";
import PrintersLib "lib/printers";
import PrintersApi "mixins/printers-api";
import FilesApi "mixins/files-api";
import AnalysisApi "mixins/analysis-api";
import JobsApi "mixins/jobs-api";
import ApiDocMixin "mixins/api-doc";

actor {
  // PrintHub domain state. Initial values come from the migration chain.
  let accessControlState : {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, { #admin; #user; #guest }>;
  };
  let printers : Map.Map<Common.PrinterId, PrinterTypes.Printer>;
  let files : Map.Map<Common.FileId, FileTypes.UploadedFile>;
  let analyses : Map.Map<Common.FileId, AnalysisTypes.AnalysisResult>;
  let jobs : Map.Map<Common.JobId, JobTypes.PrintJob>;
  let counters : { var nextFileId : Nat; var nextJobId : Nat };

  // Seed the printer catalogue once, on first start. The migration chain
  // creates the empty map; this fills it so the catalogue is always present.
  if (printers.size() == 0) {
    for (printer in PrintersLib.seedCatalogue().values()) {
      printers.add(printer.id, printer);
    };
  };

  include MixinAuthorization(accessControlState, null);
  include PrintersApi(printers, jobs);
  include FilesApi(files, counters);
  include AnalysisApi(analyses, files);
  include JobsApi(jobs, files, printers, counters, accessControlState);
  include ApiDocMixin();
  include Expose({
    entities = [
      printers.toEntityManual("printer", "Printer", "id")
        .sample({
          id = "";
          name = "";
          location = "";
          paperSizes = [#A4];
          colorModes = [#BlackAndWhite];
          isOnline = true;
          openingHours = "";
          rating = 0;
          speedPagesPerMinute = 0;
          description = "";
        })
        .payload("id", func printer = printer.id)
        .payload("name", func printer = printer.name)
        .payload("location", func printer = printer.location)
        .payload("isOnline", func printer = printer.isOnline)
        .payload("openingHours", func printer = printer.openingHours)
        .payload("rating", func printer = printer.rating)
        .payload("speedPagesPerMinute", func printer = printer.speedPagesPerMinute)
        .payload("description", func printer = printer.description)
        .public_()
        .build(),
      files.toEntity("file", "UploadedFile", "id")
        .sample({
          id = 0;
          owner = Principal.fromText("aaaaa-aa");
          fileName = "";
          storedName = "";
          contentType = "";
          sizeBytes = 0;
          pageCount = 0;
          uploadedAt = 0;
        })
        .ownedBy("owner")
        .hidden("storedName")
        .controllerOrScoped()
        .build(),
      jobs.toEntityManual("job", "PrintJob", "id")
        .sample({
          id = 0;
          jobRef = "";
          owner = Principal.fromText("aaaaa-aa");
          fileId = 0;
          fileName = "";
          pageCount = 0;
          sizeBytes = 0;
          options = {
            colorMode = #BlackAndWhite;
            copies = 1;
            paperSize = #A4;
            pageSelection = #All;
            customRange = null;
            excludedBlankPages = [];
          };
          estimatedPrice = 0;
          printerId = "";
          status = #Uploaded;
          printedPages = 0;
          createdAt = 0;
          updatedAt = 0;
        })
        .payload("id", func job = job.id)
        .payload("jobRef", func job = job.jobRef)
        .payload("owner", func job = job.owner)
        .payload("fileId", func job = job.fileId)
        .payload("fileName", func job = job.fileName)
        .payload("pageCount", func job = job.pageCount)
        .payload("sizeBytes", func job = job.sizeBytes)
        .payload("estimatedPrice", func job = job.estimatedPrice)
        .payload("printerId", func job = job.printerId)
        .payload("status", func job = job.status)
        .payload("printedPages", func job = job.printedPages)
        .payload("createdAt", func job = job.createdAt)
        .payload("updatedAt", func job = job.updatedAt)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      analyses.toEntityManual("analysis", "AnalysisResult", "fileId")
        .sample({
          fileId = 0;
          totalPages = 0;
          blankPages = [];
          nearlyBlankPages = [];
          lowContentPages = [];
          colorPages = [];
          contentPageCount = 0;
          issueNotes = [];
          analyzedAt = 0;
        })
        .payload("fileId", func analysis = analysis.fileId)
        .payload("totalPages", func analysis = analysis.totalPages)
        .payload("blankPageCount", func analysis = analysis.blankPages.size())
        .payload("nearlyBlankPageCount", func analysis = analysis.nearlyBlankPages.size())
        .payload("lowContentPageCount", func analysis = analysis.lowContentPages.size())
        .payload("colorPageCount", func analysis = analysis.colorPages.size())
        .payload("contentPageCount", func analysis = analysis.contentPageCount)
        .payload("analyzedAt", func analysis = analysis.analyzedAt)
        .controllerOnly()
        .build(),
    ];
  });
};
