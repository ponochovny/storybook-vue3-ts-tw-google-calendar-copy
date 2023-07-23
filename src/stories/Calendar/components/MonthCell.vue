<template>
	<div
		class="flex flex-1 relative px-0.5 w-full text-[11px] leading-4 text-left"
	>
		<span class="absolute top-3 left-4 text-[13px] leading-[18px]">
			{{ cell.content }}
		</span>
		<div
			v-if="newEvents && view.id === 'month'"
			class="absolute right-2 top-2 w-[5px] h-[5px] rounded-full bg-[#FF5E46]"
		></div>
		<div
			class="flex flex-col w-full gap-0.5 pt-8 text-gray-50"
			v-if="sortedEvents.length && view.id === 'month'"
		>
			<MonthEvent
				:event="sortedEvents[0]"
				:data="cell"
				:focused="selectedEvent?._eid === sortedEvents[0]._eid"
				@on-click="onEventClick"
			/>
			<div
				v-if="sortedEvents.length > 1"
				class="flex items-center gap-1 w-full"
			>
				<MonthEvent
					:event="sortedEvents[1]"
					:data="cell"
					:focused="selectedEvent?._eid === sortedEvents[1]._eid"
					@on-click="onEventClick"
					:class="[sortedEvents.length > 2 ? 'w-1/2' : 'w-full']"
				/>
				<button
					v-if="sortedEvents.length > 2"
					type="button"
					@click.stop="showMore(cell, sortedEvents, $event)"
					class="truncate m-0"
					:class="[
						containsNewEvent()
							? 'text-[#FF5E46] hover:text-[#FF5E46]/80'
							: 'text-gray-400 hover:text-gray-400/80',
					]"
				>
					+ {{ events.length - 2 }} MORE
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { MonthEvent } from '.'
import { IEventData } from '../helper/types'

export default defineComponent({
	name: 'MonthCell',
})
</script>
<script lang="ts" setup>
interface Props {
	events: any[]
	cell: any
	selectedEvent: any
	view: any
}
const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'eventClick', eventData: IEventData, clickEvent: any): (
		eventData: IEventData,
		clickEvent: any
	) => void
	(e: 'showMoreClick', cellVar: any, eventsVar: any, DOMEvent: any): (
		cellVar: any,
		eventsVar: any,
		DOMEvent: any
	) => void
}>()

const sortedEvents = computed(() =>
	props.events.sort((a, b) => (a.allDay === b.allDay ? 0 : a.allDay ? -1 : 1))
)
const newEvents = computed(
	() => !!props.events.find((event) => event.class.includes('new-data'))
)

const containsNewEvent = (): boolean => {
	const isTrue = props.events
		.slice(2)
		.find((el) => el.class.includes('new-data'))

	return isTrue
}

const onEventClick = (eventData: IEventData, clickEvent: any) => {
	//
	emit('eventClick', eventData, clickEvent)
}
const showMore = (cellVar: any, eventsVar: any, DOMEvent: any) => {
	//
	emit('showMoreClick', cellVar, eventsVar, DOMEvent)
}
</script>
