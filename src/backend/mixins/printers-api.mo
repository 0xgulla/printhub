import Map "mo:core/Map";
import Common "../types/common";
import JobTypes "../types/jobs";
import PrinterTypes "../types/printers";
import PrintersLib "../lib/printers";

mixin (
  printers : Map.Map<Common.PrinterId, PrinterTypes.Printer>,
  jobs : Map.Map<Common.JobId, JobTypes.PrintJob>,
) {
  /// List every printer in the network.
  public query func listPrinters() : async [PrinterTypes.PrinterView] {
    PrintersLib.listPrinters(printers);
  };

  /// Fetch a single printer by id.
  public query func getPrinter(printerId : Text) : async ?PrinterTypes.PrinterView {
    PrintersLib.getPrinter(printers, printerId);
  };

  /// Search printers by name or location.
  public query func searchPrinters(searchTerm : Text) : async [PrinterTypes.PrinterView] {
    PrintersLib.searchPrinters(printers, searchTerm);
  };

  /// Simulated connect to a printer device.
  public shared func connectPrinter(printerId : Text) : async PrinterTypes.ConnectResult {
    PrintersLib.connectPrinter(printers, printerId);
  };

  /// Simulated live status of a printer device.
  public query func getPrinterStatus(printerId : Text) : async ?PrinterTypes.PrinterStatus {
    PrintersLib.getPrinterStatus(printers, jobs, printerId);
  };
};
