"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ErrorSolutionsList } from "@/components/admin/error-solutions-list"
import { ErrorActivityLog } from "@/components/admin/error-activity-log"
import { ArrowLeft, Check, X, MessageSquare, User, Calendar, Tag, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ErrorDetailsPage() {
  const { id } = useParams()
  const [errorData, setErrorData] = useState({
    id: id,
    title: "TypeError: Cannot read property 'map' of undefined in React component",
    description:
      "I'm trying to render a list of items in my React component, but I'm getting this error: 'TypeError: Cannot read property 'map' of undefined'. I've checked that my API call is working correctly, but something is still wrong.",
    stackTrace: `TypeError: Cannot read property 'map' of undefined
    at ProductList (ProductList.js:15)
    at renderWithHooks (react-dom.development.js:14803)
    at mountIndeterminateComponent (react-dom.development.js:17482)
    at beginWork (react-dom.development.js:18596)
    at HTMLUnknownElement.callCallback (react-dom.development.js:188)`,
    codeSnippet: `function ProductList() {
  const [products, setProducts] = useState();
  
  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
    });
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}`,
    status: "pending",
    category: "React",
    language: "JavaScript",
    framework: "React",
    createdBy: "John Doe",
    createdAt: "May 15, 2023",
    views: 245,
    solutions: 8,
    tags: ["react", "javascript", "error-handling", "useEffect"],
  })

  const [moderationNote, setModerationNote] = useState("")

  const handleApprove = () => {
    setErrorData((prev) => ({
      ...prev,
      status: "approved",
    }))
  }

  const handleReject = () => {
    setErrorData((prev) => ({
      ...prev,
      status: "rejected",
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/errors">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Error Details</h1>
        <div className="ml-auto flex items-center gap-2">
          {errorData.status === "pending" ? (
            <>
              <Button variant="outline" onClick={handleReject}>
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleApprove}>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          ) : (
            <Badge variant={errorData.status === "approved" ? "success" : "destructive"}>
              {errorData.status === "approved" ? "Approved" : "Rejected"}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{errorData.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{errorData.language}</Badge>
                <Badge variant="outline">{errorData.framework}</Badge>
                <Badge variant="outline">{errorData.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{errorData.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Stack Trace</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{errorData.stackTrace}</pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Code Snippet</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{errorData.codeSnippet}</pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {errorData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {errorData.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Moderation Notes</CardTitle>
                <CardDescription>Add notes about why this error was approved or rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add your moderation notes here..."
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  rows={4}
                />
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReject}>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{errorData.createdBy.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Submitted by</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {errorData.createdBy}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Created
                  </span>
                  <span className="text-sm text-muted-foreground">{errorData.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Status
                  </span>
                  <Badge
                    variant={
                      errorData.status === "approved"
                        ? "success"
                        : errorData.status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {errorData.status.charAt(0).toUpperCase() + errorData.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Views</span>
                  <span className="text-sm text-muted-foreground">{errorData.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Solutions
                  </span>
                  <span className="text-sm text-muted-foreground">{errorData.solutions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="border-b pb-4 last:border-0 last:pb-0">
                    <Link href={`/admin/errors/${item}`} className="hover:underline">
                      <h4 className="font-medium line-clamp-2">
                        TypeError: Cannot read property 'length' of undefined in React
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        React
                      </Badge>
                      <span>• 85% similar</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="solutions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="solutions" className="mt-6">
          <ErrorSolutionsList errorId={id as string} />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <ErrorActivityLog errorId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
