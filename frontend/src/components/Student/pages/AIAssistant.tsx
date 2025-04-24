
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Bot, Send, FileUp, BookOpen, Brain } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your AI study assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [documentText, setDocumentText] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responseContent = getMockResponse(input);
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSummarize = () => {
    if (!documentText.trim()) return;
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      const summary = "This document discusses key concepts in database normalization, including First Normal Form (1NF), Second Normal Form (2NF), and Third Normal Form (3NF). The main points are: eliminating repeating groups, removing partial dependencies, and eliminating transitive dependencies. The document also covers BCNF and practical considerations for when to denormalize for performance.";
      
      const assistantMessage: Message = {
        id: messages.length + 1,
        role: "assistant",
        content: `📝 **Document Summary**\n\n${summary}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setActiveTab("chat");
      setDocumentText("");
      setIsLoading(false);
    }, 2000);
  };

  // Mock response generation based on user input
  const getMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("database") || lowerQuery.includes("sql")) {
      return "Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. The basic steps include eliminating repeating groups, removing partial dependencies, and eliminating transitive dependencies. Would you like me to explain any specific normal form in more detail?";
    }
    
    if (lowerQuery.includes("machine learning") || lowerQuery.includes("algorithm")) {
      return "Machine learning algorithms can be broadly categorized into supervised learning (where models are trained on labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Popular algorithms include linear regression, decision trees, neural networks, and clustering methods like k-means. What specific aspect would you like to explore?";
    }
    
    if (lowerQuery.includes("assignment") || lowerQuery.includes("help")) {
      return "I'd be happy to help with your assignment! To provide the most accurate assistance, could you share more details about what you're working on? For example, the specific topic, any requirements, or the particular concepts you're struggling with.";
    }
    
    // Default response
    return "That's an interesting question! Let me help you explore this topic further. Would you like me to provide some resources or explain the fundamental concepts related to this?";
  };

  // Study recommendations based on current courses
  const studyRecommendations = [
    {
      title: "Database Normalization Guide",
      source: "Advanced Database Systems",
      type: "Article",
    },
    {
      title: "Neural Network Architecture Explained",
      source: "Machine Learning",
      type: "Video",
    },
    {
      title: "Color Theory & Accessibility in UI Design",
      source: "UI/UX Design Principles",
      type: "Tutorial",
    },
    {
      title: "REST API Best Practices",
      source: "Web Application Architecture",
      type: "Documentation",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Study Assistant</h1>
        <p className="text-muted-foreground">Ask questions, get help with assignments, or summarize study materials</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-student-purple" />
                  AI Assistant
                </CardTitle>
                <TabsList>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="summarize">Summarize</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Ask any academic question or get help with your coursework
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TabsContent value="chat" className="mt-0">
                <div className="h-[400px] overflow-y-auto space-y-4 p-4 rounded-md border bg-muted/40 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 max-w-[80%]",
                        message.role === "user" ? "ml-auto" : ""
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-student-purple text-white">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-lg p-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs text-right mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-student-purple text-white">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse delay-150"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="summarize" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Upload or paste content to summarize</p>
                    <Textarea
                      placeholder="Paste document text here to summarize..."
                      className="h-[300px] resize-none"
                      value={documentText}
                      onChange={(e) => setDocumentText(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">
                      <FileUp className="h-4 w-4 mr-2" />
                      Upload PDF
                    </Button>
                    <Button onClick={handleSummarize} disabled={isLoading || !documentText.trim()}>
                      {isLoading ? "Processing..." : "Summarize"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>

          <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
            AI responses are for educational assistance only. Verify information before use in your assignments.
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Study Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studyRecommendations.map((item, i) => (
                <div key={i} className="flex flex-col space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{item.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.source}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Smart Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Flashcard Generator
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bot className="h-4 w-4 mr-2" />
                Practice Quiz Creator
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileUp className="h-4 w-4 mr-2" />
                Citation Formatter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
