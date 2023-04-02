<template>
	<button
		type="button"
		@click.stop="onEventClick(event, $event)"
		class="
			px-2
			py-0.5
			rounded
			text-[#8E9595]
			bg-[#F6F7F9]
			text-ellipsis
			overflow-hidden
			whitespace-nowrap
			!text-left
			hover:bg-[#F0F2F5]
			hover:text-[#808384]
			transition-colors
		"
		:class="[event.class, allDayClass()]"
		:title="event.title"
	>
		{{
			event.allDay
				? event.title
				: event.start.format('H{am}') + '-' + event.end.format('H{am}')
		}}
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IEventData } from '../helper/types'

export default defineComponent({
	name: 'MonthEvent',
})
</script>
<script lang="ts" setup>
interface Props {
	event: IEventData
	data: {
		formattedDate: string
		isFirstDay: boolean
		isLastDay: boolean
	}
}
const props = defineProps<Props>()
const emit =
	defineEmits<{
		(e: 'onClick', event: IEventData, DOMEvent: any): void
	}>()

const onEventClick = (event: IEventData, DOMEvent: any) => {
	emit('onClick', event, DOMEvent)
}
const segment = () => {
	return (
		(props.event.segments && props.event.segments[props.data.formattedDate]) ||
		null
	)
}
const allDayClass = () => {
	const { event } = props

	if (event.allDay) {
		const { isFirstDay, isLastDay } = segment() || {}
		return {
			'event-start': segment() && isFirstDay && !isLastDay,
			'event-middle': segment() && !isFirstDay && !isLastDay,
			'event-end': segment() && isLastDay && !isFirstDay,
		}
	}
	return ''
}
</script>
