module.exports = (req, res) => {
  const { diagramType } = req.body;
  
  const syntaxDocumentation = {
    sequenceDiagram: "Syntax documentation for sequence diagrams...",
    mindmap: "Syntax documentation for mind maps...",
    sankey: "Syntax documentation for sankey diagrams...",
    classDiagram: "Syntax documentation for class diagrams...",
    timeline: "Syntax documentation for timelines...",
    flowchart: "Syntax documentation for flowcharts..."
  };

  if (!syntaxDocumentation[diagramType]) {
    return res.status(400).json({ error: "Invalid diagram type" });
  }

  res.status(200).json({
    diagramSyntaxDocumentation: syntaxDocumentation[diagramType],
    systemInstructions: "Use this syntax to create your diagram."
  });
};
