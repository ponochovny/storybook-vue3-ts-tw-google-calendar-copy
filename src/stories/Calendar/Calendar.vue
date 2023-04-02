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
				<select
					name="pets"
					id="pet-select"
					v-model="timezoneSelected"
					@update:model-value="updateTimezone"
				>
					<option value="">--Please choose an option--</option>
					<option v-for="option of timezonesList" :value="option">
						{{ option }}
					</option>
				</select>
				<Button primary @click="activeView = 'month'" label="month" />
				<Button primary @click="activeView = 'week'" label="week" />
			</div>
		</div>
		<div class="relative">
			<transition @after-leave="tooltipAfterLeave">
				<div
					ref="tooltip"
					class="
						absolute
						p-6
						bg-white
						border border-gray-200
						rounded-xl
						z-10
						shadow-md
						max-w-xs
					"
					v-show="isShowTooltip"
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
					<div v-else-if="selectedEvent">
						<p>
							{{
								selectedEvent.start.getHours() +
								':' +
								selectedEvent.start.getMinutes()
							}}
							-
							{{
								selectedEvent.end.getHours() +
								':' +
								selectedEvent.end.getMinutes()
							}}
						</p>
					</div>
					<p v-else-if="!selectedEvent">Tooltip content</p>
				</div>
			</transition>
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
				showAllDayEvents
				eventsOnMonthView
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
							class="flex flex-col w-full gap-0.5 pt-8 text-gray-50"
							v-if="events.length && view.id === 'month'"
						>
							<MonthEvent
								:event="events[0]"
								:data="cell"
								@on-click="onEventClick"
							/>
							<div
								v-if="events.length > 1"
								class="flex items-center gap-1 w-full"
							>
								<MonthEvent
									:event="events[1]"
									:data="cell"
									@on-click="onEventClick"
									:class="[events.length > 2 ? 'w-1/2' : 'w-full']"
								/>
								<button
									v-if="events.length > 2"
									type="button"
									@click.stop="showMore(events, $event)"
									class="
										text-[#FF5E46] text-ellipsis
										overflow-hidden
										whitespace-nowrap
										m-0
										hover:text-[#FF5E46]/80
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
import { IEventData, TEvent } from './helper/types'
import { MonthEvent } from './components'
import { timezones } from './helper/timezones'

interface Props {
	disableViews?: 'day' | 'week' | 'month' | 'year' | 'years'[]
	events: TEvent[]
	disableCreation?: boolean
}

export default defineComponent({
	name: 'CalendarComponent',
	components: { VueCal },
})
</script>
<script lang="ts" setup>
const props = defineProps<Props>()
const emit =
	defineEmits<{
		(e: 'updateTimezone', timezoneId: string): void
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
const selectedEvent = ref<IEventData | null>(null)

const tooltipAfterLeave = () => {
	selectedEvent.value = null
	isShowMore.value = false
}

const closeTooltip = () => {
	isShowTooltip.value = false
}
const openTooltip = (target: any) => {
	tooltipTarget.value = target
	if (props.disableCreation) return Promise.reject()
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

	selectedEvent.value = eventData
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
const celldblClick = (e: any, clickEvent: any) => {
	console.log('celldblClick', e, clickEvent)
}
// working methods
const onEventClick = (eventData: any, clickEvent: any) => {
	console.log('onEventClick', eventData, clickEvent)
	if (selectedEvent.value?.start === eventData.start) return closeTooltip()
	openTooltip(clickEvent.target).then(() => (selectedEvent.value = eventData))
}
const cellClick = (e: any, clickEvent: any) => {
	console.log('cellClick', e, clickEvent)
	closeTooltip()
}
const cellContextMenu = (e: any) => {
	console.log('cellContextMenu', e)
	const target = e.e.target.classList.contains('.vuecal__cell-content')
		? e.e.target
		: e.e.target.closest('.vuecal__cell-content')
	openTooltip(target)
	console.log(target)
}
const isShowMore = ref(false)
const hiddenEvents = ref<TEvent[]>([])
const showMore = (data: any, clickEvent: any) => {
	console.log('showMore', data, clickEvent)
	openTooltip(clickEvent.target).then(() => {
		isShowMore.value = true
		hiddenEvents.value = data
	})
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
.vuecal--month-view {
	.vuecal__cell-content {
		height: 76px;
		width: 120px;
	}
	.vuecal__cell-events {
		display: none;
	}
	.event-start {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		width: calc(100% + 3px);
	}
	.event-end {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: -2px;
	}
	.event-middle {
		border-radius: 0;
		margin-left: -2px;
		width: calc(100% + 4px);
	}
}
.vuecal__event {
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
	&:hover {
		background-color: #ffe8e5;
	}
	.vuecal__event-resize-handle {
		background-color: #ffd0c8;
	}
}
</style>
