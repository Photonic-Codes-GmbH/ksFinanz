import { NgModule } from '@angular/core'

import { DocumentEditorContainerModule, DocumentEditorModule, PrintService, TextExportService, SelectionService, SearchService, EditorService, ImageResizerService,
	EditorHistoryService, ContextMenuService, OptionsPaneService, HyperlinkDialogService, TableDialogService, BookmarkDialogService, TableOfContentsDialogService,
	PageSetupDialogService, StyleDialogService, ListDialogService, ParagraphDialogService, BulletsAndNumberingDialogService, FontDialogService, TablePropertiesDialogService,
	BordersAndShadingDialogService, TableOptionsDialogService, CellOptionsDialogService, StylesDialogService,
	WordExportService, SfdtExportService, ToolbarService } from '@syncfusion/ej2-angular-documenteditor'

@NgModule({
  exports: [
		DocumentEditorContainerModule
  ],
  providers: [
		/* For DocumentEditor */ ToolbarService, PrintService, SfdtExportService, WordExportService, TextExportService, SelectionService, SearchService, EditorService, ImageResizerService,
										EditorHistoryService, ContextMenuService, OptionsPaneService, HyperlinkDialogService, TableDialogService, BookmarkDialogService, TableOfContentsDialogService,
										PageSetupDialogService, StyleDialogService, ListDialogService, ParagraphDialogService, BulletsAndNumberingDialogService, FontDialogService, TablePropertiesDialogService,
          					BordersAndShadingDialogService, TableOptionsDialogService, CellOptionsDialogService, StylesDialogService
  ]
})
export class SfDocumentEditorModule {
}