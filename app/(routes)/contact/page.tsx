"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {ArrowRight, CheckCircle2, Mail, Phone} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {ContactData} from "@/types/types";

import {sendContactMessage} from "@/app/actions/contact";
import {toast} from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<ContactData>();

  async function onSubmit(data: ContactData) {
    const result = await sendContactMessage(data);

    if (!result.success) {
      toast(result.error || "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);

    reset();
  }

  return (
    <div className="flex flex-col bg-background">
      <section>
        <div className="max-w-2xl mx-auto px-4 py-10">
          {submitted ? (
            <div className="border border-border rounded-2xl p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <CheckCircle2 size={22} />
              </div>
              <h2 className="font-heading text-2xl font-medium mt-5">
                Message sent
              </h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
                Thanks for reaching out. We&apos;ve received your message and
                will get back to you as soon as possible.
              </p>
              <Button
                variant="outline"
                className="mt-7"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-medium">
                  Send us a message
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Fill out the form below and our team will get back to you.
                </p>
              </div>
              <form
                onSubmit={handleSubmit((data) => onSubmit(data))}
                noValidate
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field data-invalid={!!errors.firstName}>
                    <FieldLabel htmlFor="firstName">First name</FieldLabel>
                    <Input
                      {...register("firstName", {
                        required: "First name is required.",
                        maxLength: {
                          value: 50,
                          message: "First name is too long."
                        }
                      })}
                      id="firstName"
                      aria-invalid={!!errors.firstName}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <FieldError>{errors.firstName.message}</FieldError>
                    )}
                  </Field>
                  <Field data-invalid={!!errors.lastName}>
                    <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                    <Input
                      {...register("lastName", {
                        required: "Last name is required.",
                        maxLength: {
                          value: 50,
                          message: "Last name is too long."
                        }
                      })}
                      id="lastName"
                      aria-invalid={!!errors.lastName}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <FieldError>{errors.lastName.message}</FieldError>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...register("email", {
                        required: "Email is required.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address."
                        }
                      })}
                      type="email"
                      id="email"
                      aria-invalid={!!errors.email}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.phone}>
                    <FieldLabel htmlFor="phone">
                      Phone number
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      {...register("phone", {
                        validate: (value) => {
                          if (!value) return true;
                          const digitsOnly = value.replace(/[^0-9]/g, "");
                          return (
                            digitsOnly.length >= 5 ||
                            "Phone number cannot be less than 5 digits."
                          );
                        },
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9+\-() *#]/g,
                            ""
                          );
                        }
                      })}
                      type="text"
                      inputMode="tel"
                      id="phone"
                      aria-invalid={!!errors.phone}
                      placeholder="+355691234567"
                    />
                    {errors.phone && (
                      <FieldError>{errors.phone.message}</FieldError>
                    )}
                  </Field>
                </div>

                <Field data-invalid={!!errors.message}>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <Textarea
                    {...register("message", {
                      required: "Message is required.",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters."
                      },
                      maxLength: {
                        value: 3000,
                        message: "Message cannot exceed 3000 characters."
                      }
                    })}
                    id="message"
                    aria-invalid={!!errors.message}
                    placeholder="Tell us how we can help..."
                    className="min-h-64 resize-y"
                  />
                  {errors.message && (
                    <FieldError>{errors.message.message}</FieldError>
                  )}
                </Field>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send message"}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Prefer to reach us directly?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-5">
            <a
              href="mailto:ttgroup@gmail.com"
              className="flex items-center gap-2 text-sm hover:underline text-secondary"
            >
              <Mail size={16} />
              ttgroup@gmail.com
            </a>
            <a
              href=":+355691234567"
              className="flex items-center gap-2 text-sm hover:underline text-secondary"
            >
              <Phone size={16} />
              +355691234567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
