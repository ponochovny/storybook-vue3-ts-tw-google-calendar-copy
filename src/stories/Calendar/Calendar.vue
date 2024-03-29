<template>
	<div class="relative max-w-[834px]">
		<div class="flex py-4">
			<Button
				primary
				@click=";(selectedDate = new Date('2023-04-03')), closeTooltip()"
				label="Set date to - 2023-04-03"
			/>
		</div>
		<div class="flex justify-between items-center gap-2 py-2">
			<div>
				<span class="mr-2">
					{{ monthLabel }}
				</span>
				<Button primary @click="vuecal.previous()" label="<" />
				<Button primary @click="vuecal.next()" label=">" />
				<Button
					primary
					@click="
						vuecal.switchView('month', new Date()), (selectedDate = new Date())
					"
					label="Today"
				/>
			</div>
			<div>
				<select v-model="timezoneSelected" @update:model-value="updateTimezone">
					<option value="">--Please choose an option--</option>
					<option v-for="option of timezonesList" :value="option" :key="option">
						{{ option }}
					</option>
				</select>
				<Button primary @click="activeView = 'month'" label="month" />
				<Button primary @click="activeView = 'week'" label="week" />
			</div>
		</div>
		<div class="relative h-[502px]">
			<transition>
				<div
					ref="centeredTooltip"
					class="absolute bg-white p-2 px-3 sm:p-6 rounded-xl shadow-lg max-w-[calc(100%/7_+_40px)] max-h-96 z-10 w-full"
					:class="{ 'pointer-events-none': !isShowMore }"
					v-show="isShowMore"
				>
					<div class="text-xs truncate mb-1">popper tooltip contetn</div>
					<ul class="flex flex-col gap-1">
						<li
							v-for="event of hiddenEvents"
							:key="event._eid"
							class="text-[11px]/[14px] events-list"
						>
							<MonthEvent
								variant="list-item"
								:event="event"
								:data="{
									formattedDate: format(selectedDate, 'yyyy-MM-dd'),
									isFirstDay: false,
									isLastDay: false,
								}"
								:focused="selectedEvent?._eid === event._eid"
								@on-click="onEventClick"
								:class="'w-full'"
							/>
						</li>
					</ul>
				</div>
			</transition>
			<transition @after-leave="tooltipAfterLeave">
				<CalendarTooltip
					ref="tooltip"
					v-show="isShowTooltip"
					:selectedDate="selectedDate"
					:event-data="selectedEvent"
					:isCreateNew="isCreateNewData"
					@create="createEventHandler($event, true)"
					@edit="createEventHandler($event, false)"
					@close="closeTooltip"
				/>
			</transition>
			<vue-cal
				ref="vuecal"
				small
				:events="events"
				:disable-views="disableViews"
				:active-view="activeView"
				:selected-date="selectedDate"
				:minDate="new Date()"
				:dblclickToNavigate="false"
				:snapToTime="5"
				:timeStep="60"
				timeFormat="HH:mm"
				showAllDayEvents
				eventsOnMonthView
				hideViewSelector
				hideTitleBar
				todayButton
				editableEvents
				overlapsPerTimeStep
				:onEventClick="onEventClick"
				:onEventDblclick="onEventDblclick"
				:on-event-create="onEventCreate"
				@event-drag-create="eventDragCreate"
				@cell-click="cellClick"
				@cell-dblclick="celldblClick"
				@event-title-change="eventTitleChange"
				@event-duration-change="eventDurationChange"
				@event-drop="eventDrop"
				cell-contextmenu
				@cell-contextmenu="cellContextMenu"
			>
				<template #cell-content="{ cell, view, events }">
					<MonthCell
						:cell="cell"
						:events="events"
						:view="view"
						:selected-event="selectedEvent"
						@eventClick="onEventClick"
						@showMoreClick="showMore"
					/>
				</template>
				<template #event="{ event }">
					<div
						class="text-[11px]/[16px] text-left"
						:class="[
							!differenceInHours(event.end, event.start) &&
							differenceInMinutes(event.end, event.start) <= 30
								? 'pt-0.5 pl-3'
								: event.allDay
								? 'py-0.5 px-1'
								: 'pt-2 pl-3',
						]"
						:title="event.title"
					>
						{{
							event.allDay
								? event.title
								: format(event.start, 'h:mmaaa') +
								  '-' +
								  format(event.end, 'h:mmaaa')
						}}
					</div>
				</template>
				<template #time-cell="{ hours, minutes }">
					<div class="vuecal__time-cell-line">
						<span v-if="hours">
							{{
								format(new Date(new Date().setHours(hours, minutes, 0)), 'h a')
							}}
						</span>
					</div>
				</template>
			</vue-cal>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, defineProps, computed } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import Button from '../Button/Button.vue'
import { createPopper } from '@popperjs/core'
import { IEventData, TEvent } from './helper/types'
import { MonthCell, MonthEvent } from './components'
import CalendarTooltip from '../CalendarTooltip/CalendarTooltip.vue'
import { timezones } from './helper/timezones'
import { differenceInHours, differenceInMinutes, isSameDay } from 'date-fns'
import format from 'date-fns/format'
import { v4 as uuidv4 } from 'uuid'

interface Props {
	disableViews?: 'day' | 'week' | 'month' | 'year' | 'years'[]
	events: TEvent[]
	disableCreation?: boolean
}

export default defineComponent({
	name: 'CalendarComponent',
	components: { VueCal, MonthCell },
})
</script>
<script lang="ts" setup>
const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'updateTimezone', timezoneId: string): void
	(e: 'newEvent', data: TEvent): void
	(e: 'editEvent', data: TEvent): void
}>()

//
const timezonesList = ref(timezones)
const timezoneSelected = ref('')
const updateTimezone = (timezoneId: any) => {
	emit('updateTimezone', timezoneId)
}
//

const vuecal = ref<any>(null)
const activeView = ref<'day' | 'week' | 'month' | 'year' | 'year'>('month')
const monthLabel = computed(() => {
	const { startDate, endDate } = vuecal.value?.view ?? {}
	const [startMonth, endMonth] = [startDate, endDate].map((date) =>
		date?.getMonth()
	)
	const getFullMonth = (date: Date) => {
		return date?.toLocaleString('default', { month: 'long' })
	}
	const startMonthName = getFullMonth(startDate)
	if (startMonth === endMonth) return startMonthName
	return `${startMonthName}-${getFullMonth(endDate)}`
})
const selectedDate = ref<Date>(new Date())

const tooltip = ref<any>(null)
const tooltipTarget = ref<any>(null)
const centeredTooltip = ref<any>(null)
const tooltipOffset = ref([0, 10])
const setOffset = (data: number[]) => {
	tooltipOffset.value = data
	popperInstanceCentered.value.update()
}
const popperInstanceCentered = computed(() => {
	return createPopper(
		tooltipTarget.value.closest('.vuecal__cell') as Element,
		centeredTooltip.value,
		{
			placement: 'auto',
			modifiers: [
				{
					name: 'flip',
					options: {
						allowedAutoPlacements: ['top', 'bottom'],
						boundary: tooltipTarget.value.closest('.vuecal'),
					},
				},
				{
					name: 'offset',
					options: {
						offset: tooltipOffset.value,
					},
				},
			],
		}
	)
})
const popperInstance = computed(() => {
	return createPopper(tooltipTarget.value as Element, tooltip.value.$el, {
		placement: 'auto',
		modifiers: [
			{
				name: 'flip',
				options: {
					allowedAutoPlacements: ['top', 'left', 'right'],
				},
			},
			{
				name: 'offset',
				options: {
					offset: [0, 10],
				},
			},
		],
	})
})
const generatePopper = (): Promise<any> => {
	if (isShowTooltip.value) {
		console.log('update')
		return popperInstance.value?.update()
	} else {
		setTimeout(() => {
			console.log('forceUpdate')
			popperInstance.value?.forceUpdate()
		})
		return Promise.resolve()
	}
}

const isShowTooltip = ref(false)
const isCreateNewData = ref(false)
const selectedEvent = ref<IEventData | null>(null)

const createEventHandler = (data: TEvent, isNew: boolean) => {
	console.log('createEventHandler', data)
	console.log('isNew', isNew)
	closeTooltip()
	if (isNew) {
		emit('newEvent', data)
	} else {
		emit('editEvent', data)
	}
}

const tooltipAfterLeave = () => {
	selectedEvent.value = null
	isCreateNewData.value = false
}

const closeTooltip = () => {
	isShowTooltip.value = false
}
const openTooltip = (target: any) => {
	tooltipTarget.value = target
	return new Promise((resolve, reject) => {
		try {
			generatePopper().then(() => {
				isShowTooltip.value = true
				tooltipAfterLeave()
				return resolve({ status: 'success' })
			})
		} catch (e: any) {
			reject(e)
		}
	})
}

const onEventDblclick = (eventData: any, clickEvent: any) => {
	console.log('onEventDblclick', eventData, clickEvent)

	// selectedEvent.value = eventData;
}
const eventTitleChange = (e: any, clickEvent: any) => {
	console.log('eventTitleChange', e, clickEvent)
}
const eventDurationChange = (e: any, clickEvent: any) => {
	console.log('eventDurationChange', e, clickEvent)
}
const eventDrop = (e: any) => {
	console.log('eventDrop', e)
}
const celldblClick = (e: Date, clickEvent: any) => {
	console.log('celldblClick', e, clickEvent)

	activeView.value = 'week'
	selectedDate.value = e
}
// working methods
const onEventClick = (eventData: IEventData, clickEvent: any) => {
	console.log('onEventClick', eventData, clickEvent)
	const isShowMoreEventClicked = hiddenEvents.value.find(
		(e) => e._eid === eventData._eid
	)
	if (
		!isSameDay(new Date(selectedDate.value), new Date(eventData.start)) &&
		!isShowMoreEventClicked
	) {
		isShowMore.value = false
	}
	if (
		selectedEvent.value?.start === eventData.start &&
		!isShowMoreEventClicked
	) {
		return closeTooltip()
	}
	openTooltip(clickEvent.target).then(() => (selectedEvent.value = eventData))
}
const cellClick = (e: any) => {
	if (
		new Date(new Date(selectedDate.value).setHours(0, 0, 0)).valueOf() !==
		new Date(new Date(e).setHours(0, 0, 0)).valueOf()
	)
		isShowMore.value = false
	console.log('cellClick', e)
	closeTooltip()
}
const cellContextMenu = (e: any) => {
	if (props.disableCreation) return
	console.log('cellContextMenu', e)
	isShowMore.value = false

	const target = e.e.target.classList.contains('.vuecal__cell-content')
		? e.e.target
		: e.e.target.closest('.vuecal__cell-content')
	openTooltip(target).then(() => {
		selectedDate.value = e.date
		isCreateNewData.value = true
	})
}
const deleteEventFunction = ref(() => {})
const onEventCreate = (e: any, outDeleteEventFunction: () => void) => {
	console.log('onEventCreate', e)
	deleteEventFunction.value = outDeleteEventFunction
	// set deleteEventFunction in ref
	e.class = `new-data ${e._eid}`
	return true
}
const eventDragCreate = (e: {
	allDay: boolean
	background: boolean
	class: string
	content: string
	daysCount: number
	end: Date
	endTimeMinutes: number
	split: null
	start: Date
	startTimeMinutes: number
	title: string
	_eid: string
}) => {
	console.log('eventDragCreate', e)
	// if event time comparing in minuted less than 15 - return false
	// const hoursDiff = differenceInHours(e.end, e.start)
	// const minutesDiff = differenceInMinutes(e.end, e.start)
	// console.log(hoursDiff)
	// console.log(minutesDiff)
	// console.log(hoursDiff === 0 && minutesDiff < 15)
	// if (hoursDiff === 0 && minutesDiff < 15) {
	// 	console.log('DONT CREATE')
	// 	deleteEventFunction.value()
	// }
	console.log('CREATE')
	// trigger popper open on target with class 'e._eid'
	// if clicked 'save' => save new data
	// if clicked 'cancel' => trigger deleteEventFunction and clear deleteEventFunction ref

	emit('newEvent', {
		class: 'new-data',
		end: format(e.end, 'yyyy-MM-dd HH:mm'),
		start: format(e.start, 'yyyy-MM-dd HH:mm'),
		title: '',
		id: uuidv4(),
	})
}
const isShowMore = ref(false)
const hiddenEvents = ref<IEventData[]>([])
const showMore = (cell: any, events: IEventData[], clickEvent: any) => {
	console.log('showMore')
	closeTooltip()
	selectedDate.value = new Date(cell.formattedDate)
	if (!isShowMore.value) {
		isShowTooltip.value = false
		tooltipTarget.value = clickEvent.target
		hiddenEvents.value = events
		popperInstanceCentered.value?.update()
		setTimeout(() => {
			const cellHalfHeight =
				tooltipTarget.value.closest('.vuecal__cell').offsetHeight / 2
			const tooltipHalfHeight = centeredTooltip.value.offsetHeight / 2
			const needNumber = `-${cellHalfHeight + tooltipHalfHeight}`
			setOffset([0, +needNumber])
		})
		isShowMore.value = true
	} else {
		tooltipTarget.value = clickEvent.target
		hiddenEvents.value = events
		setTimeout(() => {
			const cellHalfHeight =
				tooltipTarget.value.closest('.vuecal__cell').offsetHeight / 2
			const tooltipHalfHeight = centeredTooltip.value.offsetHeight / 2
			const needNumber = `-${cellHalfHeight + tooltipHalfHeight}`
			setOffset([0, +needNumber])

			popperInstanceCentered.value?.update()
		})
	}
	// }
}
</script>
<style lang="scss">
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
	transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

/* Green-theme. */
.vuecal__menu,
.vuecal__cell-events-count {
	background-color: #42b983;
}
.vuecal__title-bar {
	background-color: #e4f5ef;
}
.vuecal__cell--today,
.vuecal__cell--current {
	background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {
	background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell--selected:before {
	border-color: rgba(66, 185, 131, 0.5);
}
/* Cells and buttons get highlighted when an event is dragged over it. */
.vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal__cell-split--highlighted {
	background-color: rgba(195, 255, 225, 0.5);
}
.vuecal__arrow.vuecal__arrow--highlighted,
.vuecal__view-btn.vuecal__view-btn--highlighted {
	background-color: rgba(136, 236, 191, 0.25);
}

/* CUSTOM */
.vuecal--week-view {
	.vuecal__cell {
		padding: 0 2px;
	}
	.vuecal__event {
		border-radius: 4px;
	}
}
.vuecal--month-view {
	.vuecal__cell-content {
		height: 76px;
		max-width: 120px;
		width: 100%;
	}
	.vuecal__cell-events {
		display: none;
	}
}

.vuecal__all-day {
	.vuecal__cell {
		padding: 2px;
	}
	.vuecal__all-day-text span {
		display: none;
	}
}
.vuecal__event {
	border: 1px solid transparent;
	background-color: #f6f7f9;
	&:hover {
		background-color: #f0f2f5;
	}

	.vuecal__event-resize-handle {
		background-color: #dde0e0;
	}
}
.new-data {
	background-color: #ffefed;
	border: 1px solid transparent;
	&:hover {
		background-color: #ffe8e5;
	}
	.vuecal__event-resize-handle {
		background-color: #ffd0c8;
	}
	&.vuecal__event--focus {
		border-color: #ff5e46;
	}
	// @media (prefers-color-scheme: dark) {
	// 	&.vuecal__event--focus {
	// 		border-color: #ffffff;
	// 	}
	// }
}
// @media (prefers-color-scheme: dark) {
// 	.new-data {
// 		color: #1b1b1b;
// 		background-color: #ff9487;
// 		&:hover {
// 			color: #1b1b1b;
// 			background-color: #ff9e92;
// 		}
// 	}
// }

.event-start,
.vuecal__event.event-start {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	width: calc(100% + 3px);
}
.vuecal__event--focus:not(.new-data) {
	border-color: rgb(186, 186, 186);
	// @media (prefers-color-scheme: dark) {
	// 	border-color: #1b1b1b;
	// }
}
.vuecal__event--focus {
	box-shadow: rgba(154, 154, 154, 0.4) 0px 0px 7px;
}
.vuecal__event--focus.event-start,
.vuecal__event--focus.event-middle,
.vuecal__event--focus.event-end {
	box-shadow: rgba(154, 154, 154, 0.4) -6px 0px 7px;
}
.vuecal__event--focus.event-middle {
	z-index: 1;
	box-shadow: rgba(154, 154, 154, 0.4) 0px 0px 7px;
}
.vuecal__event--focus.event-end {
	box-shadow: rgba(154, 154, 154, 0.4) 6px 0px 7px;
}
.new-data.event-start,
.new-data.event-middle,
.vuecal__event.event-start,
.vuecal__event.event-middle {
	border-right: 0;
}
.new-data.event-end,
.new-data.event-middle,
.vuecal__event.event-end,
.vuecal__event.event-middle {
	border-left: 0;
}
.event-end,
.vuecal__event.event-end {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	margin-left: -2px;
	width: calc(100% + 2px);
}
.event-middle,
.vuecal__event.event-middle {
	border-radius: 0;
	margin-left: -2px;
	width: calc(100% + 4px);
}

.events-list {
	.event-start,
	.vuecal__event.event-start {
		position: relative;
		width: 100%;
		// &::after {
		// content: "";
		// position: absolute;
		// top: 50%;
		// left: 100%;
		// transform: translateY(-50%);
		// margin-left: 0px;
		// border-width: 10px;
		// border-style: solid;
		// border-color: transparent transparent transparent #ffefec;
		// }
	}
	.event-start,
	.vuecal__event.event-middle {
	}
	.event-start,
	.vuecal__event.event-end {
	}
}
</style>
