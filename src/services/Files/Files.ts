import { nanoid } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { store } from "@/src/redux";
import { uploadFilesApi } from "@/src/axios";
import { hashingString } from "@/src/utils";
import { FileOptions, SetErrorType, Path } from "@/src/types";

import { Params } from "./Files.type";

const {
  VITE_CLOUDINARY_CLOUD_NAME,
  VITE_CLOUDINARY_API_KEY,
  VITE_CLOUDINARY_API_SECRET,
} = import.meta.env;

class FilesService {
  private static defaultId = store.getState().userSlice.user.id;
  private cloudName = VITE_CLOUDINARY_CLOUD_NAME;
  private apiKey = VITE_CLOUDINARY_API_KEY;
  private apiSecret = VITE_CLOUDINARY_API_SECRET;
  private formats = ["webp"];

  constructor(
    private id: string | number = FilesService.defaultId,
    private setError?: SetErrorType
  ) {}

  private createSignature(params: Params) {
    const baseString = Object.keys(params)
      .map((key) => `${key}=${params[key as keyof Params]}`)
      .join("&");

    return hashingString(`${baseString}${this.apiSecret}`);
  }

  private imageTransformString({
    avatar,
    transform,
    height = 216,
    width = 216,
    radius = 10,
  }: Partial<FileOptions>) {
    if (avatar)
      return transform
        ? transform
        : `c_thumb,h_${height},w_${width}/r_${radius}`;

    return transform ? transform : `c_thumb,h_${height},w_${width}`;
  }

  async upload(
    file: File | string,
    {
      avatar = false,
      path,
      overwrite = true,
      format = "webp",
      tags = [],
      formats = [],
      alt,
      ...args
    }: FileOptions = {}
  ) {
    try {
      const defaultPath = avatar ? Path.AVATAR : Path.POSTS;
      const imageTags = tags.length ? tags : defaultPath.split("/");
      const context = `alt=${alt ? alt : defaultPath.split("/")}`;

      const params = {
        allowed_formats: [...this.formats, ...formats],
        context,
        eager: this.imageTransformString({ avatar, ...args }),
        folder: path || defaultPath,
        format,
        overwrite,
        public_id: avatar ? `${this.id}` : this.id + "/" + nanoid(),
        tags: imageTags,
        timestamp: Math.floor(Date.now() / 1000),
      };
      const signature = this.createSignature(params);

      const res = await uploadFilesApi.post(`${this.cloudName}/image/upload`, {
        file,
        api_key: this.apiKey,
        signature,
        ...params,
      });

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.setError && this.setError(error);
        return error;
      }
    }
  }

  private getPublicIdFromUrl(url: string, sliceValue: number = -4) {
    return url.split("/").slice(sliceValue).join("/").split(".")[0];
  }

  async delete(url: string, sliceValue?: number) {
    try {
      const params = {
        invalidate: true,
        public_id: this.getPublicIdFromUrl(url, sliceValue),
        timestamp: Math.floor(Date.now() / 1000),
      };

      const signature = this.createSignature(params);

      const res = await uploadFilesApi.post(`${this.cloudName}/image/destroy`, {
        api_key: this.apiKey,
        signature,
        ...params,
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.setError && this.setError(error);
        return error;
      }
    }
  }
}

export default FilesService;
