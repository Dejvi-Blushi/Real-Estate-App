"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

import {Input} from "@/components/ui/input";

import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {Textarea} from "@/components/ui/textarea";

import type {FormData, FullFormData, MarkerPosition} from "@/types/types";
import {useForm, Controller} from "react-hook-form";
import {toast} from "sonner";

import {useSupabaseClient} from "@/lib/supabase/client";

import {usePathname} from "next/navigation";

import {useRouter} from "next/navigation";
import {Upload} from "lucide-react";
import ImagePreviewGrid from "./ImagePreview";
import {getDate, randomNumericId} from "@/utils/randomNumericId";
import ListingImageEditor from "./ListingImageEditor";
import {Card} from "../ui/card";

import {cities} from "@/lib/data/cities";
import {propertyTypes} from "@/lib/data/propertyTypes";

type FetchedData = MarkerPosition & {
  defaultData?: FormData;
  listingId?: number;
};

export default function FormComponent({
  markerPosition,
  defaultData,
  listingId
}: FetchedData) {
  const pathname = usePathname();

  const isEditMode = pathname.startsWith("/edit-listing");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: {errors, isSubmitting}
  } = useForm<FullFormData>({
    defaultValues: {
      title: defaultData?.title ?? "",
      description: defaultData?.description ?? "",
      price: defaultData?.price ?? undefined,
      area_size: defaultData?.area_size ?? undefined,
      bedrooms: defaultData?.bedrooms ?? undefined,
      bathrooms: defaultData?.bathrooms ?? undefined,
      address: defaultData?.address ?? "",
      listing_type: defaultData?.listing_type ?? "rent",
      property_type: defaultData?.property_type ?? "",
      city: defaultData?.city ?? "",
      contact_info: defaultData?.contact_info ?? ""
    }
  });

  const supabase = useSupabaseClient();

  const submitData = async (data: FullFormData) => {
    if (!markerPosition?.lat || !markerPosition?.lng) {
      toast("Please select a location in the map.");
      return;
    }

    const fullData = {
      ...data,
      latitude: Number(markerPosition.lat.toFixed(6)),
      longtitude: Number(markerPosition.lng.toFixed(6))
    };

    const {images, ...listingData} = fullData;

    if (isEditMode && listingId) {
      await updateData(listingData);
    } else {
      await insertData(images, listingData);
    }
  };

  const insertData = async (images: File[], listingData: FormData) => {
    try {
      const {data: listing, error} = await supabase
        .from("listings")
        .insert(listingData)
        .select()
        .single();

      if (error) {
        throw new Error("Listing data insertion failed. Please try again.");
      }

      let uploadErorAmount = 0;

      for (const [index, file] of images.entries()) {
        const path = `${listing.id}/${listing.id}-${getDate()}-${randomNumericId()}`;

        const {error: RowUploadError} = await supabase
          .from("listing_images")
          .insert({listing_id: listing.id, path, position: index});
        if (RowUploadError) {
          uploadErorAmount++;
          continue;
        }

        const {error: FileUploadError} = await supabase.storage
          .from("listing-images")
          .upload(path, file);

        if (FileUploadError) {
          uploadErorAmount++;
        }
      }

      if (uploadErorAmount === 0) {
        toast("Submission was successful.");
      } else if (uploadErorAmount === 1) {
        toast("Submission was successful, but 1 image failed to upload.");
      } else {
        toast(
          `Submission was successful, but ${uploadErorAmount} images failed to upload.`
        );
      }
    } catch {
      toast("Something went wrong. Please try again.");
    }
  };

  const updateData = async (listingData: FormData) => {
    try {
      const {error} = await supabase
        .from("listings")
        .update(listingData)
        .eq("id", listingId);

      if (error) {
        throw new Error("Listing data update failed. Please try again.");
      }

      toast("Submission was successful.");
    } catch {
      toast("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="shadow-xl">
      <form
        onSubmit={handleSubmit((data) => submitData(data))}
        noValidate
        className="p-4"
      >
        <FieldSet className="mb-5">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Controller
                control={control}
                name="listing_type"
                rules={{required: true}}
                render={({field}) => (
                  <Field>
                    <FieldLabel htmlFor="listing_type">Listing Type</FieldLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="rent" id="rent" />
                        <Label htmlFor="rent">Rent</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="sell" id="sell" />
                        <Label htmlFor="sell">Sell</Label>
                      </div>
                    </RadioGroup>
                  </Field>
                )}
              ></Controller>

              <Controller
                control={control}
                name="property_type"
                rules={{required: "A property type is required."}}
                render={({field, fieldState}) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="mt-4 md:mt-0"
                  >
                    <FieldLabel htmlFor="property_type">
                      Property Type
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="property_type"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a property type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {propertyTypes.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mb-4">
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                {...register("title", {required: "Title is required."})}
                type="text"
                id="title"
                aria-invalid={!!errors.title}
                placeholder="Eg. Apartament 2+1 for rent – Komuna e Parisit"
              />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>

              <Textarea
                {...register("description", {
                  required: "Description is required."
                })}
                id="description"
                aria-invalid={!!errors.description}
                placeholder="Add a description for the property"
                className="resize-none"
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">{"Price (Euros)"}</FieldLabel>
                <Input
                  {...register("price", {
                    required: "Price is required.",
                    valueAsNumber: true,

                    min: {value: 1, message: "Price cannot be 0 or negative."}
                  })}
                  type="number"
                  id="price"
                  aria-invalid={!!errors.price}
                  placeholder="Eg. 210000"
                />
                {errors.price && (
                  <FieldError>{errors.price.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.area_size}>
                <FieldLabel htmlFor="area_size">
                  Total Square Meters Area
                </FieldLabel>
                <Input
                  {...register("area_size", {
                    valueAsNumber: true,
                    required: "Total square meters area is required.",
                    min: {
                      value: 1,
                      message:
                        "Total square meters area cannot be 0 or negative."
                    }
                  })}
                  type="number"
                  id="area_size"
                  aria-invalid={!!errors.area_size}
                  placeholder="Eg. 117"
                />
                {errors.area_size && (
                  <FieldError>{errors.area_size.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.bedrooms}>
                <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
                <Input
                  {...register("bedrooms", {
                    valueAsNumber: true,
                    required: "Bedrooms is required",
                    min: {
                      value: 1,
                      message: "Bedrooms cannot be be 0 or negative."
                    },
                    validate: (value) =>
                      Number.isInteger(value) ||
                      "Bedrooms must be a whole number."
                  })}
                  type="number"
                  id="bedrooms"
                  aria-invalid={!!errors.bedrooms}
                  placeholder="Eg. 2"
                />
                {errors.bedrooms && (
                  <FieldError>{errors.bedrooms.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.bathrooms}>
                <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                <Input
                  {...register("bathrooms", {
                    valueAsNumber: true,
                    required: "Bathrooms is required",
                    min: {
                      value: 1,
                      message: "Bathrooms cannot be be 0 or negative."
                    }
                  })}
                  type="number"
                  id="bathrooms"
                  aria-invalid={!!errors.bathrooms}
                  placeholder="Eg. 1"
                />
                {errors.bathrooms && (
                  <FieldError>{errors.bathrooms.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.address}>
                <FieldLabel htmlFor="address">Address</FieldLabel>

                <Input
                  {...register("address", {
                    required: "Address is required."
                  })}
                  type="text"
                  id="address"
                  aria-invalid={!!errors.address}
                  placeholder="Eg. Rruga Komuna Parisit"
                />
                {errors.address && (
                  <FieldError>{errors.address.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.contact_info}>
                <FieldLabel htmlFor="contact_info">Contact Info</FieldLabel>
                <Input
                  {...register("contact_info", {
                    required: "Contact Info is required.",
                    validate: (value) => {
                      const digitsOnly = value.replace(/[^0-9]/g, "");
                      return (
                        digitsOnly.length >= 5 ||
                        "Contact info cannot be less than 5 digits."
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
                  id="contact_info"
                  aria-invalid={!!errors.contact_info}
                  placeholder="Eg. +355671234567"
                />
                {errors.contact_info && (
                  <FieldError>{errors.contact_info.message}</FieldError>
                )}
              </Field>

              <Controller
                control={control}
                name="city"
                rules={{required: "A city is required."}}
                render={({field, fieldState}) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="mt-4 md:mt-0"
                  >
                    <FieldLabel htmlFor="city">City</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="city"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {cities.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mt-5">
          <FieldGroup>
            <div className="flex items-center justify-center w-full">
              {isEditMode && listingId ? (
                <ListingImageEditor listingId={listingId} />
              ) : (
                <Controller
                  control={control}
                  name="images"
                  rules={{
                    validate: (files) =>
                      (files && files.length > 0) ||
                      "At least one image is required."
                  }}
                  render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Images</FieldLabel>

                      <FieldLabel
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-40 bg-muted/50 hover:bg-muted border rounded-xl border-input rounded-base cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center text-muted-foreground pt-5 pb-6">
                          <Upload />
                          <p className="mb-2 text-sm font-semibold">
                            Click to upload
                          </p>
                          <p className="text-xs">
                            PNG, JPG/JPEG or WEBP (MAX. 10MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          multiple
                          aria-invalid={fieldState.invalid}
                          accept="image/png, image/jpg, image/jpeg, image/webp"
                          onChange={(e) => {
                            if (e.target.files) {
                              const newFiles = Array.from(e.target.files);
                              field.onChange([
                                ...(field.value ?? []),
                                ...newFiles
                              ]);
                            }
                            e.target.value = "";
                          }}
                        />
                      </FieldLabel>

                      <ImagePreviewGrid
                        files={field.value ?? []}
                        onRemove={(index) => {
                          const next = [...(field.value ?? [])];
                          next.splice(index, 1);
                          field.onChange(next);
                        }}
                      />

                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                ></Controller>
              )}
            </div>

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submiting..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Go Back
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </Card>
  );
}
