import { Step, StepType } from "../type";

// Helper function to remove markdown code block directives
function cleanCodeContent(code: string): string {
    // First, let's ensure we're working with a trimmed string to avoid any edge cases
    let cleanCode = code.trim();
    
    // Remove opening markdown directive (```language) if present
    // This regex matches three backticks followed by optional language identifier and whitespace
    cleanCode = cleanCode.replace(/^```(?:[\w-]+)?\s*/, '');
    
    // Remove closing markdown directive (```) if present
    // This regex matches three backticks and any surrounding whitespace at the end
    cleanCode = cleanCode.replace(/\s*```\s*$/, '');
    
    // Final trim to ensure clean output
    return cleanCode.trim();
}

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
            // File creation step with cleaned code content
            steps.push({
                id: stepId++,
                title: `Create ${filePath || 'file'}`,
                type: StepType.CreateFile,
                status: 'pending',
                code: cleanCodeContent(content.trim()),
                path: filePath
            });
        } else if (type === 'shell') {
            // Shell command step with cleaned code content
            steps.push({
                id: stepId++,
                title: 'Run command',
                type: StepType.RunScript,
                status: 'pending',
                code: cleanCodeContent(content.trim())
            });
        }
    }
    
    return steps;
}