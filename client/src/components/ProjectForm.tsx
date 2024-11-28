import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import type { Project } from "../lib/types";
import { useUploadImage } from "../lib/hooks/useUploadImage";
import { useState } from "react";

// フォームのスキーマを定義
const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  image: z.string().min(1, "画像は必須です"),
  link: z.string().url("有効なURLを入力してください").optional(),
  technologies: z.string(),
});

type FormValues = {
  title: string;
  description: string;
  image: string;
  link?: string;
  technologies: string;
};

interface ProjectFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  initialData?: Partial<Project>;
  isSubmitting?: boolean;
}

export default function ProjectForm({ onSubmit, initialData, isSubmitting }: ProjectFormProps) {
  const { toast } = useToast();
  const { uploadImage, isUploading, error: uploadError } = useUploadImage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      link: initialData?.link || "",
      technologies: initialData?.technologies ? initialData.technologies.join(", ") : "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      form.setValue("image", imageUrl);
      setPreviewUrl(imageUrl);
      toast({
        title: "成功",
        description: "画像がアップロードされました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "画像のアップロードに失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      const formattedData = {
        ...data,
        technologies: data.technologies.split(",").map(tech => tech.trim()).filter(Boolean)
      };
      await onSubmit(formattedData as any);
      toast({
        title: "成功",
        description: "プロジェクトが保存されました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "プロジェクトの保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="プロジェクトのタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="プロジェクトの説明"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>画像</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  {previewUrl && (
                    <div className="relative w-full h-48">
                      <img
                        src={previewUrl}
                        alt="プレビュー"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <Input
                    type="hidden"
                    {...field}
                    value={value}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プロジェクトURL（任意）</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>技術スタック（カンマ区切り）</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Node.js" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || isUploading}
        >
          {isUploading ? "アップロード中..." : "保存"}
        </Button>
      </form>
    </Form>
  );
}
