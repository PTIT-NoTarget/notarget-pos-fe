<script lang="ts" setup>
definePage({
  meta: {
    hideHeader: true,
    title: "Cài đặt",
    requireOTP: false,
    requireAuth: false,
  },
});
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import {
  Alignment,
  Bold,
  ClassicEditor,
  Clipboard,
  Essentials,
  Font,
  Heading,
  Image,
  ImageInsert, ImageResize, ImageResizeEditing, ImageResizeHandles, ImageStyle, ImageToolbar, ImageUpload,
  Italic,
  Paragraph,
  PasteFromOffice,
  SourceEditing,
  Table,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  Base64UploadAdapter,
} from "ckeditor5";

import { computed, ref } from "vue";
import "ckeditor5/ckeditor5.css";

const data = ref("");

const config = computed(() => {
  return {
    plugins: [
      Essentials, Paragraph, Bold, Italic, Underline,
      Table, TableToolbar, TableProperties, TableColumnResize, TableCellProperties,
      Alignment, SourceEditing, PasteFromOffice, Clipboard, Font, Heading,
      Image, ImageToolbar, ImageStyle, ImageResize, ImageInsert, ImageResizeEditing, ImageResizeHandles, ImageUpload,
      Base64UploadAdapter,
    ],
    toolbar: [
      "undo", "redo", "|",
      "sourceEditing", "|",
      "bold", "italic", "underline", "|",
      "fontSize", "fontFamily", "fontColor", "fontBackgroundColor", "|",
      "heading", "alignment:left", "alignment:center", "alignment:right", "alignment:justify", "|",
      "insertTable", "link", "insertImage", "|",
    ],
    table: {
      contentToolbar: [
        "tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties",
      ],
    },
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:wrapText",
      ],
    },
    shouldNotGroupWhenFull: true,
    licenseKey: "GPL",
  };
});

const save = () => {
  console.log(data.value);
};
</script>

<template>
  <ckeditor
    v-model="data"
    :config="config"
    :editor="ClassicEditor"
  />
  <button @click="save">Lưu</button>
</template>

<style lang="sass" scoped></style>
