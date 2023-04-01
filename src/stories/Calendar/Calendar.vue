<template>
	<div class="relative max-w-[834px]">
		<h1>{{ title }}</h1>
		<div class="flex py-4">
			<Button
				primary
				@click="selectedDate = new Date('2023-04-03')"
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
				<Button primary @click="activeView = 'month'" label="month" />
				<Button primary @click="activeView = 'week'" label="week" />
			</div>
		</div>
		<div class="relative">
			<!-- <div
				class="
					absolute
					left-0
					top-0
					w-full
					h-full
					bg-gray-900/70
					z-10
					transition-opacity
					flex
					justify-center
					items-center
				"
				:class="[
					isTooltipOpened ? 'opacity-100' : 'opacity-0 pointer-events-none',
				]"
				@click.self=";(isTooltipOpened = false), (isShowMore = false)"
			>
				<div class="flex flex-col gap-2 p-6 rounded-lg bg-white shadow-md">
					<template v-if="isShowMore">
						<ul>
							<li v-for="event of hiddenEvents">
								{{
									`${event?.start.getHours()}:${event?.start.getMinutes()}-${event?.end.getHours()}:${event?.end.getMinutes()}`
								}}
							</li>
						</ul>
					</template>
					<template v-else>
						<h2>{{ selectedEvent?.title }}</h2>
						<div class="flex gap-1">
							<strong>Start date&time:</strong>
							<span>{{
								selectedEvent?.start.format('YYYY/MM/D hh:mm{am}')
							}}</span>
						</div>
						<div class="flex gap-1">
							<strong>End date&time:</strong>
							<span>{{
								selectedEvent?.end.format('YYYY/MM/D hh:mm{am}')
							}}</span>
						</div>
					</template>
				</div>
			</div> -->
			<div
				ref="tooltip"
				class="
					absolute
					p-6
					bg-white
					rounded-xl
					z-10
					shadow-md
					max-w-xs
					opacity-0
					pointer-events-none
					data-[show=true]:opacity-100 data-[show=true]:pointer-events-auto
					transition-opacity
				"
			>
				{{
					isShowMore ? 'additional info' : selectedEvent ? 'Event:' : 'Cell:'
				}}
				<div v-if="isShowMore">
					<p>More info</p>
					<ul>
						<li v-for="event of hiddenEvents">
							{{
								`${new Date(event.start).getFullYear()}/${new Date(
									event.start
								).getMonth()}/${new Date(event.start).getDate()}`
							}}-{{
								`${new Date(event.end).getFullYear()}/${new Date(
									event.end
								).getMonth()}/${new Date(event.end).getDate()}`
							}}
						</li>
					</ul>
				</div>
				<p v-else-if="selectedEvent">{{ selectedEvent.start }}</p>
				<p v-else-if="!selectedEvent">Tooltip content</p>
			</div>
			<vue-cal
				ref="vuecal"
				:events="events"
				:disable-views="disableViews"
				:active-view="activeView"
				:selected-date="selectedDate"
				:minDate="new Date()"
				:dblclickToNavigate="false"
				:snapToTime="5"
				:timeStep="60"
				timeFormat="HH:mm"
				hideViewSelector
				hideTitleBar
				todayButton
				editableEvents
				:onEventClick="onEventClick"
				:onEventDblclick="onEventDblclick"
				@cell-click="cellClick"
				@cell-dblclick="celldblClick"
				@event-title-change="eventTitleChange"
				@event-duration-change="eventDurationChange"
				@event-drop="eventDrop"
				cell-contextmenu
				@cell-contextmenu="cellContextMenu"
			>
				<!-- <template #events-count="{ events, view }">
				<span> 1_{{ customEventsCount(events) }} </span>
			</template> -->
				<template #cell-content="{ cell, view, events }">
					<div
						class="
							flex flex-1
							relative
							px-0.5
							w-full
							text-[11px]
							leading-4
							text-left
						"
					>
						<span class="absolute top-3 left-4 text-[13px] leading-[18px]">
							{{ cell.content }}
						</span>
						<div
							class="
								flex flex-col
								w-full
								gap-0.5
								pt-8
								text-gray-50 text-ellipsis
								overflow-hidden
								whitespace-nowrap
							"
							v-if="events.length && view.id === 'month'"
						>
							<button
								type="button"
								@click.stop="onEventClick(events[0], $event)"
								class="px-2 py-0.5 rounded bg-gray-400 w-full !text-left"
								:title="events[0].title"
							>
								{{
									events[0].start.format('H{am}') +
									'-' +
									events[0].end.format('H{am}')
								}}
							</button>
							<div
								v-if="events.length > 1"
								class="flex items-center gap-1 w-full"
							>
								<button
									type="button"
									@click.stop="onEventClick(events[1], $event)"
									class="
										px-2
										py-0.5
										rounded
										bg-gray-400
										text-ellipsis
										overflow-hidden
										whitespace-nowrap
										!text-left
									"
									:class="[events.length > 2 ? 'w-1/2' : 'w-full']"
									:title="events[1].title"
								>
									{{
										`${events[1].start.format('H{am}')}-${events[1].end.format(
											'H{am}'
										)}`
									}}
								</button>
								<button
									v-if="events.length > 2"
									type="button"
									@click.stop="showMore(events.slice(2), $event)"
									class="
										text-red-700 text-ellipsis
										overflow-hidden
										whitespace-nowrap
										m-0
									"
								>
									+ {{ events.length - 2 }} more
								</button>
							</div>
						</div>
					</div>
				</template>
				<template #event="{ event, view }">me</template>
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
const tooltip = ref<any>(null)
const tooltipTarget = ref<any>(null)
const popperInstance = computed(() => {
	return createPopper(tooltipTarget.value as Element, tooltip.value, {
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
const generatePopper = (block: Element) => {
	tooltipTarget.value = block
	// createPopper(block, tooltip.value, {
	// 	placement: 'auto',
	// })
	popperInstance.value?.forceUpdate()
}

interface Props {
	title?: string
	disableViews?: 'day' | 'week' | 'month' | 'year' | 'years'[]
}

type TEvent = {
	start: Date
	end: Date
	title?: string
}

type TDateMethod = {
	format: (format: string) => any
}

interface IEventData {
	allDay: boolean
	class: string
	end: Date & TDateMethod
	start: Date & TDateMethod
	focused: boolean
	title: string
	_eid: string
}

export default defineComponent({
	name: 'CalendarComponent',
	components: { VueCal },
})
</script>
<script lang="ts" setup>
defineProps<Props>()
const vuecal = ref<any>(null)
const activeView = ref<'day' | 'week' | 'month' | 'year' | 'year'>('month')
const monthLabel = computed(() => {
	const startDate = vuecal.value?.view.startDate
	const endDate = vuecal.value?.view.endDate
	const startDateMonth = vuecal.value?.view.startDate.getMonth()
	const endDateMonth = vuecal.value?.view.endDate.getMonth()
	const getFullMonth = (date: Date) => {
		return date?.toLocaleString('default', { month: 'long' })
	}
	if (startDateMonth === endDateMonth) return getFullMonth(startDate)
	return getFullMonth(startDate) + '-' + getFullMonth(endDate)
})
const selectedDate = ref<Date>(new Date())
const events = ref<TEvent[]>([
	{
		start: new Date('2023-04-01 12:30'),
		end: new Date('2023-04-01 13:45'),
		title: 'Some title',
	},
	{
		start: new Date('2023-04-01 14:30'),
		end: new Date('2023-04-01 15:00'),
		title: 'Some title',
	},
	{
		start: new Date('2023-04-01 16:00'),
		end: new Date('2023-04-01 17:10'),
		title: 'Some title',
	},
	{
		start: new Date('2023-04-01 17:20'),
		end: new Date('2023-04-01 18:00'),
		title: 'Some title',
	},
	//
	{
		start: new Date('2023-04-02 12:30'),
		end: new Date('2023-04-02 13:45'),
		title: 'Some title',
	},
	{
		start: new Date('2023-04-02 14:30'),
		end: new Date('2023-04-02 15:00'),
		title: 'Some title',
	},
	//
	{
		start: new Date('2023-04-03 12:30'),
		end: new Date('2023-04-03 13:45'),
		title: 'Some title',
	},
	{
		start: new Date('2023-04-03 14:30'),
		end: new Date('2023-04-03 15:00'),
		title: 'Some title',
	},
	{
		start: new Date('2023-04-03 16:00'),
		end: new Date('2023-04-03 17:10'),
		title: 'Some title',
	},
	//
	{
		start: new Date('2023-04-04 12:30'),
		end: new Date('2023-04-04 13:45'),
		title: 'Some title',
	},
])

const isTooltipOpened = ref(false)
const selectedEvent = ref<IEventData | null>(null)

const resetTooltip = () => {
	isShowMore.value = false
	selectedEvent.value = null
	tooltip.value?.setAttribute('data-show', false)
}
const openTooltip = (target: any) => {
	tooltip.value?.setAttribute('data-show', true)
	isTooltipOpened.value = true
	generatePopper(target)
}

const onEventClick = (eventData: any, clickEvent: any) => {
	console.log('onEventClick', eventData, clickEvent)
	resetTooltip()
	selectedEvent.value = eventData
	openTooltip(clickEvent.target)
}
const onEventDblclick = (eventData: any, clickEvent: any) => {
	console.log('onEventDblclick', eventData, clickEvent)

	selectedEvent.value = eventData
	// isTooltipOpened.value = true
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
const cellClick = (e: any, clickEvent: any) => {
	console.log('cellClick', e, clickEvent)
	resetTooltip()
}
const celldblClick = (e: any, clickEvent: any) => {
	console.log('celldblClick', e, clickEvent)
	resetTooltip()
}
const cellContextMenu = (e: any) => {
	console.log('cellContextMenu', e)
	resetTooltip()
	const target = e.e.target.classList.contains('.vuecal__cell-content')
		? e.e.target
		: e.e.target.closest('.vuecal__cell-content')
	openTooltip(target)
	console.log(target)
}
const isShowMore = ref(false)
const hiddenEvents = ref<TEvent[]>([])
const showMore = (data: any, e: any) => {
	console.log('showMore', data, e)
	resetTooltip()
	openTooltip(e.target)

	isShowMore.value = true
	hiddenEvents.value = data
}

const customEventsCount = (data: any) => {
	console.log('customEventsCount', data)
	return 'customEventsCount'
}
const cellContent = (cellData: any, eventsData: any) => {
	console.log('cellContent', cellData, eventsData)
	return 'cellContent'
}
</script>
<style>
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
.vuecal--month-view .vuecal__cell-content {
	height: 76px;
	width: 120px;
}
</style>
