
load = function() {
    schematic = new Schematic(d3.select("body"), debug=true);
    battery0 = new Battery(schematic);
    wire0 = new Wire(schematic);
    wire1 = new Wire(schematic);
};
