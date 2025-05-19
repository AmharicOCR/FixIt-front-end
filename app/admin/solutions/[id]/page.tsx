"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { SolutionCommentsList } from "@/components/admin/solution-comments-list"
import { ArrowLeft, Check, X, ThumbsUp, User, Calendar, Link2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function SolutionDetailsPage() {
  const { id } = useParams()
  const [solutionData, setSolutionData] = useState({
    id: id,
    title: "Fix for TypeError: Cannot read property 'map' of undefined",
    description:
      "This error occurs because you're trying to map over an array that is initially undefined. You need to add a check before mapping to ensure the array exists.",
    codeSnippet: `function ProductList() {
  const [products, setProducts] = useState([]);  // Initialize with empty array
  
  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
    });
  }, []);
  
  return (
    <div>
      {products && products.map(product => (  // Add a check here
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}`,
    explanation:
      "The issue is that you're initializing your state with 'undefined' and then immediately trying to call .map() on it before your API call completes. There are two ways to fix this:\n\n1. Initialize your state with an empty array instead of undefined\n2. Add a conditional check before mapping\n\nI've implemented both solutions in the code above. This ensures that even if the API call hasn't completed yet, your component won't crash.",
    status: "pending",
    errorId: "12345",
    errorTitle: "TypeError: Cannot read property 'map' of undefined in React component",
    createdBy: "Jane Smith",
    createdAt: "May 17, 2023",
    votes: 32,
    comments: 5,
  })

  const [moderationNote, setModerationNote] = useState("")

  const handleApprove = () => {
    setSolutionData((prev) => ({
      ...prev,
      status: "approved",
    }))
  }

  const handleReject = () => {
    setSolutionData((prev) => ({
      ...prev,
      status: "rejected",
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/solutions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Solution Details</h1>
        <div className="ml-auto flex items-center gap-2">
          {solutionData.status === "pending" ? (
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
            <Badge variant={solutionData.status === "approved" ? "success" : "destructive"}>
              {solutionData.status === "approved" ? "Approved" : "Rejected"}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{solutionData.title}</CardTitle>
              <Link
                href={`/admin/errors/${solutionData.errorId}`}
                className="text-sm text-muted-foreground hover:underline flex items-center"
              >
                <Link2 className="mr-1 h-3 w-3" />
                For error: {solutionData.errorTitle}
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{solutionData.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Code Solution</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{solutionData.codeSnippet}</pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Explanation</h3>
                <p className="text-muted-foreground whitespace-pre-line">{solutionData.explanation}</p>
              </div>
            </CardContent>
          </Card>

          {solutionData.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Moderation Notes</CardTitle>
                <CardDescription>Add notes about why this solution was approved or rejected</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>User comments on this solution</CardDescription>
            </CardHeader>
            <CardContent>
              <SolutionCommentsList solutionId={id as string} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solution Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{solutionData.createdBy.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Submitted by</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {solutionData.createdBy}
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
                  <span className="text-sm text-muted-foreground">{solutionData.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Status
                  </span>
                  <Badge
                    variant={
                      solutionData.status === "approved"
                        ? "success"
                        : solutionData.status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {solutionData.status.charAt(0).toUpperCase() + solutionData.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Votes
                  </span>
                  <span className="text-sm text-muted-foreground">{solutionData.votes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Comments</span>
                  <span className="text-sm text-muted-foreground">{solutionData.comments}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alternative Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="border-b pb-4 last:border-0 last:pb-0">
                    <Link href={`/admin/solutions/${item}`} className="hover:underline">
                      <h4 className="font-medium line-clamp-2">Alternative fix for TypeError in React components</h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {12 + item} votes
                      </span>
                      <span>• For same error</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
