import OQL "mo:caffeineai-oql";

module {
  /// Convert a demo payment status variant to a queryable text value.
  public func _toRow(self : { #NotStarted; #DemoPending; #DemoConfirmed }) : OQL.Value {
    #text(
      switch self {
        case (#NotStarted) "NotStarted";
        case (#DemoPending) "DemoPending";
        case (#DemoConfirmed) "DemoConfirmed";
      }
    );
  };
};
