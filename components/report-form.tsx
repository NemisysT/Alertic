"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
//Finally, exam's over
const isBrowser = typeof window !== "undefined";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  reportType: z.enum(["Localised Weather", "Disaster"], {
    required_error: "Please select a report type.",
  }),
  latitude: z
    .string()
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= -90 && Number.parseFloat(val) <= 90, {
      message: "Latitude must be a valid number between -90 and 90.",
    }),
  longitude: z
    .string()
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= -180 && Number.parseFloat(val) <= 180,
      {
        message: "Longitude must be a valid number between -180 and 180.",
      },
    ),
  image: z
    .any()
    .optional()
    .refine(
      (val) => {
        if (!isBrowser) return true; // Skip validation in SSR
        return val instanceof FileList && val.length > 0;
      },
      { message: "Image must be a valid FileList with at least one file" }
    ),
})

type FormValues = z.infer<typeof formSchema>

export function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      category: "",
      reportType: "Localised Weather",
      latitude: "",
      longitude: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Convert image to base64 if available
      let imageBase64 = ""
      if (data.image && data.image.length > 0) {
        const file = data.image[0]
        const reader = new FileReader()
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result as string
            resolve(base64.split(",")[1] || "")
          }
          reader.readAsDataURL(file)
        })
      }

      // Prepare data for API
      const reportData = {
        description: data.description,
        category: data.category,
        latitude: Number.parseFloat(data.latitude),
        longitude: Number.parseFloat(data.longitude),
        image: imageBase64 || "no-image",
        reportType: data.reportType,
      }

      // Send to API
      const response = await fetch("http://localhost:8000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit report")
      }

      setSubmitStatus("success")
      form.reset()
    } catch (error) {
      console.error("Error submitting report:", error)
      setSubmitStatus("error")
      setErrorMessage("Failed to submit report. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude.toString())
          form.setValue("longitude", position.coords.longitude.toString())
        },
        (error) => {
          console.error("Error getting location:", error)
          setErrorMessage("Failed to get your location. Please enter coordinates manually.")
          setSubmitStatus("error")
        },
      )
    } else {
      setErrorMessage("Geolocation is not supported by your browser. Please enter coordinates manually.")
      setSubmitStatus("error")
    }
  }

  return (
    <div className="space-y-4">
      {submitStatus === "success" && (
        <Alert className="bg-green-900/20 border-green-900 text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your report has been submitted successfully. Thank you for contributing to community safety.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the situation or emergency..."
                    className="resize-none h-24"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide a clear description of what you're reporting.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Weather">Weather</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Fire">Fire</SelectItem>
                    <SelectItem value="Utility">Utility</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the category that best describes your report.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Localised Weather">Localised Weather</SelectItem>
                    <SelectItem value="Disaster">Disaster</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select whether this is a local weather event or a disaster.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 40.7128" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. -74.0060" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full">
            Use My Current Location
          </Button>

          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image (Optional)</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...fieldProps} />
                </FormControl>
                <FormDescription>Upload an image related to your report if available.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

