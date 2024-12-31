import { Step, StepType } from "../type";

export function parseXml(response: string): Step[] {
    // Extract the XML content between <voltArtifact> tags
    const xmlMatch = response.match(/<voltArtifact[^>]*>([\s\S]*?)<\/voltArtifact>/);
    
    if (!xmlMatch) {
      return [];
    }
  
    const xmlContent = xmlMatch[1];
    const steps: Step[] = [];
    let stepId = 1;
  
    // Extract artifact title
    const titleMatch = response.match(/title="([^"]*)"/);
    const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';
  
    // Add initial artifact step
    steps.push({
      id: stepId++,
      title: artifactTitle,
      type: StepType.CreateFolder,
      status: 'pending'
    });
  
    // Regular expression to find voltAction elements
    const actionRegex = /<voltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/voltAction>/g;
    
    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;
  
      if (type === 'file') {
        // File creation step
        steps.push({
          id: stepId++,
          title: `Create ${filePath || 'file'}`,
          type: StepType.CreateFile,
          status: 'pending',
          code: content.trim(),
          path: filePath
        });
      } else if (type === 'shell') {
        // Shell command step
        steps.push({
          id: stepId++,
          title: 'Run command',
          type: StepType.RunScript,
          status: 'pending',
          code: content.trim()
        });
      }
    }
  
    return steps;
  }