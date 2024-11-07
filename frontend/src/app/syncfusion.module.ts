import { NgModule } from '@angular/core'

import { ButtonModule, CheckBoxModule, ChipListModule, SwitchModule } from '@syncfusion/ej2-angular-buttons'
import { DatePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars'
import { ColorPickerModule, TextBoxModule, SliderModule } from '@syncfusion/ej2-angular-inputs'
import { KanbanModule } from '@syncfusion/ej2-angular-kanban'
import { ScheduleModule, YearService } from '@syncfusion/ej2-angular-schedule'
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns'
import { AccumulationAnnotationService, AccumulationChartModule, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AreaSeriesService, ChartAllModule, ChartModule, ColumnSeriesService, MultiColoredAreaSeriesService, PieSeriesService, RangeAreaSeriesService, SplineAreaSeriesService, SplineRangeAreaSeriesService, SplineSeriesService, StackingAreaSeriesService, StackingStepAreaSeriesService, StepAreaSeriesService, ZoomService } from '@syncfusion/ej2-angular-charts'
import { AgendaService, DayService, MonthAgendaService, MonthService, TimelineMonthService, TimelineViewsService, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule'
import { CategoryService, DataLabelService, LegendService, LineSeriesService, TooltipService } from '@syncfusion/ej2-angular-charts'
import { AppBarModule, SidebarModule, TabModule } from '@syncfusion/ej2-angular-navigations'
import { ListViewModule } from '@syncfusion/ej2-angular-lists'
import { CircularGaugeModule, GaugeTooltipService } from '@syncfusion/ej2-angular-circulargauge'
import { PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids'
import { ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons'
import { FormsModule } from '@angular/forms'
import { MapsModule } from '@syncfusion/ej2-angular-maps'
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups'

@NgModule({
  exports: [
    KanbanModule,
		ButtonModule,
		CheckBoxModule,
		ColorPickerModule,
		TextBoxModule,
		DatePickerModule,
		TimePickerModule,
		ScheduleModule,
		DropDownListModule,
		ChartModule, ChartAllModule, AccumulationChartModule,
    AppBarModule,
    SidebarModule,
    ListViewModule,
    CircularGaugeModule,
    GridModule,
		TabModule,
		MapsModule,
		ProgressButtonModule,
		SwitchModule,
		ChipListModule,
		FormsModule,
		DialogModule,
		TooltipModule,
		SliderModule,
  ],
  providers: [
		/* For Schedule */ DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, YearService,
		/* For Chart */ CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService, AreaSeriesService, RangeAreaSeriesService, StepAreaSeriesService, StackingAreaSeriesService,
                    MultiColoredAreaSeriesService,StackingStepAreaSeriesService,SplineRangeAreaSeriesService, ColumnSeriesService, SplineSeriesService, SplineAreaSeriesService,
		/* For Pie and Donut */ PieSeriesService, AccumulationLegendService, AccumulationTooltipService, AccumulationDataLabelService, AccumulationAnnotationService,
    /* For CircularGauge */ GaugeTooltipService,
		/* For Grid */ PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService,
		/* For Maps */ ZoomService,
  ]
})
export class SyncfusionModule {
}