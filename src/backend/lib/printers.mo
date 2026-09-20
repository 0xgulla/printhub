import Map "mo:core/Map";
import Time "mo:core/Time";
import Common "../types/common";
import JobTypes "../types/jobs";
import Types "../types/printers";

module {
  /// Seed catalogue of PrintHub printers. Kept as a module-level function so
  /// the migration chain can populate the stable map on first install.
  public func seedCatalogue() : [Types.Printer] {
    [
      {
        id = "PH-001";
        name = "Central Library Printer";
        location = "Central Library, Rajkot";
        paperSizes = [#A4, #A3];
        colorModes = [#BlackAndWhite, #Color];
        isOnline = true;
        openingHours = "Mon-Sat 9:00 AM - 8:00 PM";
        rating = 5;
        speedPagesPerMinute = 30;
        description = "High-speed duplex printer next to the reading hall. Best for long documents.";
      },
      {
        id = "PH-002";
        name = "College Print Hub";
        location = "ABC College, Block C";
        paperSizes = [#A4];
        colorModes = [#BlackAndWhite];
        isOnline = true;
        openingHours = "Mon-Fri 8:30 AM - 6:00 PM";
        rating = 4;
        speedPagesPerMinute = 22;
        description = "Student-run print desk inside the campus. Cheapest black & white rates.";
      },
      {
        id = "PH-003";
        name = "Cyber Cafe - Main Market";
        location = "Main Market, Patna";
        paperSizes = [#A4, #A3];
        colorModes = [#BlackAndWhite, #Color];
        isOnline = true;
        openingHours = "Daily 10:00 AM - 10:00 PM";
        rating = 4;
        speedPagesPerMinute = 18;
        description = "Colour printing, scanning and lamination. Open late every day.";
      },
      {
        id = "PH-004";
        name = "City Stationery & Prints";
        location = "Station Road, Rajkot";
        paperSizes = [#A4];
        colorModes = [#BlackAndWhite, #Color];
        isOnline = false;
        openingHours = "Mon-Sat 10:00 AM - 7:00 PM";
        rating = 3;
        speedPagesPerMinute = 15;
        description = "Neighbourhood stationery shop with a single colour printer. Currently offline.";
      },
      {
        id = "PH-005";
        name = "TechPark Express Print";
        location = "TechPark Tower B, Ahmedabad";
        paperSizes = [#A4, #A3];
        colorModes = [#BlackAndWhite, #Color];
        isOnline = true;
        openingHours = "Mon-Fri 9:00 AM - 9:00 PM";
        rating = 5;
        speedPagesPerMinute = 40;
        description = "Office-grade laser printer for bulk jobs. Fastest device on the network.";
      },
      {
        id = "PH-006";
        name = "Campus Corner Xerox";
        location = "University Gate, Vadodara";
        paperSizes = [#A4];
        colorModes = [#BlackAndWhite];
        isOnline = false;
        openingHours = "Mon-Sat 9:30 AM - 8:30 PM";
        rating = 3;
        speedPagesPerMinute = 12;
        description = "Budget xerox counter near the university gate. Offline for maintenance.";
      },
    ];
  };

  /// List every printer in the network.
  public func listPrinters(printers : Map.Map<Common.PrinterId, Types.Printer>) : [Types.PrinterView] {
    printers.values().map(toView).toArray();
  };

  /// Fetch a single printer by id.
  public func getPrinter(printers : Map.Map<Common.PrinterId, Types.Printer>, printerId : Common.PrinterId) : ?Types.PrinterView {
    switch (printers.get(printerId)) {
      case (?printer) ?toView(printer);
      case null null;
    };
  };

  /// Search printers by name or location (case-insensitive).
  public func searchPrinters(printers : Map.Map<Common.PrinterId, Types.Printer>, searchTerm : Text) : [Types.PrinterView] {
    let term = searchTerm.toLower();
    if (term == "") {
      return listPrinters(printers);
    };
    printers.values()
      .filter(func printer = printer.name.toLower().contains(#text term) or printer.location.toLower().contains(#text term))
      .map(toView)
      .toArray();
  };

  /// Simulated connect to a printer device.
  public func connectPrinter(printers : Map.Map<Common.PrinterId, Types.Printer>, printerId : Common.PrinterId) : Types.ConnectResult {
    switch (printers.get(printerId)) {
      case (?printer) {
        {
          printerId;
          connected = printer.isOnline;
          state = if (printer.isOnline) "ONLINE" else "OFFLINE";
        };
      };
      case null {
        { printerId; connected = false; state = "UNKNOWN" };
      };
    };
  };

  /// Simulated live status of a printer device, including any active job.
  public func getPrinterStatus(
    printers : Map.Map<Common.PrinterId, Types.Printer>,
    jobs : Map.Map<Common.JobId, JobTypes.PrintJob>,
    printerId : Common.PrinterId,
  ) : ?Types.PrinterStatus {
    switch (printers.get(printerId)) {
      case (?printer) {
        var activeJobId : ?Common.JobId = null;
        for ((jobId, job) in jobs.entries()) {
          if (job.printerId == printerId and job.status == #Printing) {
            activeJobId := ?jobId;
          };
        };
        ?{
          printerId;
          isOnline = printer.isOnline;
          state = if (printer.isOnline) "ONLINE" else "OFFLINE";
          activeJobId;
          updatedAt = Time.now();
        };
      };
      case null null;
    };
  };

  /// Convert an internal printer record to its shared view.
  public func toView(printer : Types.Printer) : Types.PrinterView {
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
  };
};
