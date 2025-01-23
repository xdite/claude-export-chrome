// Types definitions
interface Config {
    includeTimestamps: boolean;
    includeFileContent: boolean;
    exportFormat: 'readable' | 'json' | 'markdown';
}

interface Sender {
    role: string;
    name?: string;
}

interface Content {
    type: string;
    text?: string;
}

interface Attachment {
    extracted_content?: string;
}

interface Message {
    created_at: string;
    sender: string;
    content: Content[];
    attachments?: Attachment[];
}

interface ConversationData {
    created_at: string;
    chat_messages: Message[];
}

// Configuration for the export
const config: Config = {
    includeTimestamps: true,
    includeFileContent: true,
    exportFormat: 'markdown'
};

// Format a readable timestamp
function formatTimestamp(isoString: string): string {
    return new Date(isoString).toLocaleString();
}

// Format a single message
function formatMessage(message: Message, config: Config): string {
    let formatted = '';
    
    if (config.includeTimestamps) {
        formatted += `[${formatTimestamp(message.created_at)}]\n`;
    }
    
    formatted += `${message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}: `;
    
    // Add message content
    message.content.forEach(content => {
        if (content.type === 'text' && content.text) {
            formatted += content.text;
        }
    });
    
    // Add file content if present and enabled
    if (config.includeFileContent && message.attachments && message.attachments.length > 0) {
        message.attachments.forEach(attachment => {
            if (attachment.extracted_content) {
                formatted += '\n\n[Attached File Content]:\n' + attachment.extracted_content;
            }
        });
    }
    
    return formatted + '\n\n';
}

// Format a single message in markdown format
function formatMessageMarkdown(message: Message): string {
    let formatted = '';
    
    if (config.includeTimestamps) {
        formatted += `> ${formatTimestamp(message.created_at)}\n\n`;
    }
    
    const sender = message.sender.charAt(0).toUpperCase() + message.sender.slice(1);
    formatted += `**${sender}**: `;
    
    message.content.forEach(content => {
        if (content.type === 'text' && content.text) {
            formatted += content.text;
        }
    });
    
    if (config.includeFileContent && message.attachments && message.attachments.length > 0) {
        message.attachments.forEach(attachment => {
            if (attachment.extracted_content) {
                formatted += '\n\n```\n' + attachment.extracted_content + '\n```';
            }
        });
    }
    
    return formatted + '\n\n---\n\n';
}

// Format the entire conversation
function formatConversation(data: ConversationData, config: Config): string {
    if (config.exportFormat === 'json') {
        return JSON.stringify(data, null, 2);
    }
    
    if (config.exportFormat === 'markdown') {
        let output = `# Claude Chat Export\n\n`;
        output += `*Exported at: ${formatTimestamp(data.created_at)}*\n\n---\n\n`;
        
        data.chat_messages.forEach(message => {
            output += formatMessageMarkdown(message);
        });
        
        return output;
    }

    let output = 'Claude Chat Export\n';
    output += `Timestamp: ${formatTimestamp(data.created_at)}\n\n`;
    
    data.chat_messages.forEach(message => {
        output += formatMessage(message, config);
    });
    
    return output;
}

// Download the formatted content
function downloadContent(content: string, format: 'json' | 'readable' | 'markdown'): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt';
    a.href = url;
    a.download = `claude-chat-${timestamp}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to extract a snippet based on starting and ending indices
function extractSnippet(startIndex: number, endIndex: number): string | null {
    // Select all <script nonce> tags
    const scriptTags = document.querySelectorAll('script[nonce]');

    // Iterate through each script tag and check for "lastActiveOrg"
    for (const script of scriptTags) {
        const content = script.textContent;
        if (!content) continue;
        
        console.log(content); // Output the content of each script tag

        // Check if the content contains "lastActiveOrg"
        const index = content.indexOf('lastActiveOrg');
        if (index !== -1) {
            console.log('Found "lastActiveOrg" in script content');
            const snippet = content.substring(index + 28, index + 64);
            console.log('Snippet:', snippet); // Log the extracted snippet
            return snippet; // Return the extracted snippet
        }
    }

    console.log('Finished checking all script tags');
    return null; // Return null if "lastActiveOrg" is not found
}

// Main export function
async function exportConversation(): Promise<void> {
    try {
        // Get chat UUID from URL
        const chatId = window.location.pathname.split('/').pop();
        if (!chatId) {
            throw new Error('Could not find chat ID in URL');
        }
        console.log('Chat UUID:', chatId);

        // Extract org ID using the new parsing logic
        const orgId = extractSnippet(28, 64);
        if (!orgId) {
            throw new Error('Could not find organization ID');
        }
        console.log('Org ID:', orgId);

        // Construct and fetch the API URL
        const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}?tree=True&rendering_mode=messages&render_all_tools=true`;
        console.log('Fetching from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch conversation data: ${response.status} ${response.statusText}`);
        }

        const data: ConversationData = await response.json();
        
        // Format and download the conversation
        const formatted = formatConversation(data, config);
        downloadContent(formatted, config.exportFormat);
        
        console.log('Export completed successfully!');
    } catch (error) {
        console.error('Error exporting chat:', error instanceof Error ? error.message : 'Unknown error');
        alert('Error exporting chat: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
}

// Run the export
export { exportConversation }; 