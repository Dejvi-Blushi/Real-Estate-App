"use client";

import {useEffect, useState} from "react";
import {X, Upload} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useSupabaseClient} from "@/lib/supabase/client";
import {getDate, randomNumericId} from "@/utils/randomNumericId";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Field, FieldLabel} from "../ui/field";

type ListingImageRow = {
  id: number;
  path: string;
  position: number;
  url: string;
};

export default function ListingImageEditor({listingId}: {listingId: number}) {
  const supabase = useSupabaseClient();

  const [images, setImages] = useState<ListingImageRow[]>([]);

  async function fetchImages() {
    const {data, error} = await supabase
      .from("listing_images")
      .select("id, path, position")
      .eq("listing_id", listingId)
      .order("position", {ascending: true});

    if (error) {
      toast("Couldn't retreive listing images. Please try again.");
      return;
    }

    const dataWithImages = data.map((img) => ({
      ...img,
      url: supabase.storage.from("listing-images").getPublicUrl(img.path).data
        .publicUrl
    }));

    setImages(dataWithImages);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchImages();
  }, []);

  const handleUpload = async (files: FileList) => {
    let uploadErorAmount = 0;

    try {
      const allowedTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp"
      ];

      for (const file of Array.from(files)) {
        if (!allowedTypes.includes(file.type)) {
          uploadErorAmount++;
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          uploadErorAmount++;
          continue;
        }

        const {data: maxRow} = await supabase
          .from("listing_images")
          .select("position")
          .eq("listing_id", listingId)
          .order("position", {ascending: false})
          .limit(1)
          .single();

        const nextPosition = maxRow ? maxRow.position + 1 : 0;
        const path = `${listingId}/${listingId}-${getDate()}-${randomNumericId()}`;

        const {error: rowError} = await supabase.from("listing_images").insert({
          listing_id: listingId,
          path,
          position: nextPosition
        });

        if (rowError) {
          uploadErorAmount++;
          continue;
        }

        const {error: uploadError} = await supabase.storage
          .from("listing-images")
          .upload(path, file);

        if (uploadError) {
          uploadErorAmount++;
        }
      }

      if (uploadErorAmount === 0) {
        toast("Submission was successful.");
      } else if (uploadErorAmount === 1) {
        toast("1 Image failed to upload. Please try again.");
      } else {
        toast(`${uploadErorAmount} images failed to upload. Please try again.`);
      }

      await fetchImages();
    } catch {
      toast("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id: number, path: string) => {
    try {
      const {error: storageError} = await supabase.storage
        .from("listing-images")
        .remove([path]);

      if (storageError) {
        toast("Failed to delete the image. Please try again.");
        return;
      }

      const {error: rowError} = await supabase
        .from("listing_images")
        .delete()
        .eq("id", id);

      if (rowError) {
        toast("Failed to delete the image. Please try again.");
        return;
      }

      toast("Image deleted successfully.");

      await fetchImages();
    } catch {
      toast("Something went wrong. Please try again.");
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (images.length <= 1) {
      e.preventDefault();
      toast("A listing must have at least one image.");
      return;
    }
  };

  return (
    <Field>
      <FieldLabel>Images</FieldLabel>

      <FieldLabel
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-40 bg-muted/50 hover:bg-muted border rounded-xl border-input rounded-base cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center text-muted-foreground pt-5 pb-6">
          <Upload />
          <p className="mb-2 text-sm font-semibold">Click to upload</p>
          <p className="text-xs">PNG, JPG/JPEG or WEBP (MAX. 10MB)</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          multiple
          accept="image/png, image/jpg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </FieldLabel>

      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <AlertDialog>
              <AlertDialogTrigger asChild onClick={handleTriggerClick}>
                <Button
                  type="button"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 bg-background/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this image?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this image from your listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(img.id, img.path)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </Field>
  );
}
