<template>
	<div
		@click.stop="onEventClick(event, $event)"
		class="vuecal__event px-2 py-0.5 rounded text-[#8E9595] bg-[#F6F7F9] truncate !text-left hover:bg-[#F0F2F5] hover:text-[#808384] transition-colors h-5 cursor-pointer"
		:class="[
			event.class,
			allDayClass(),
			focused ? 'vuecal__event--focus' : '',
			variant === 'list-item' ? '!overflow-visible' : 'overflow-hidden',
			{
				'arrow-right': isSegmentStart(),
				'arrow-right arrow-left': isSegmentMiddle(),
				'arrow-left': isSegmentEnd(),
			},
		]"
		:title="event.title"
	>
		<p class="truncate">
			{{
				event.allDay
					? event.title
					: event.start.format('H{am}') + '-' + event.end.format('H{am}')
			}}
		</p>
	</div>
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
	focused: boolean
	variant?: 'list-item'
}
const props = defineProps<Props>()
const emit = defineEmits<{
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
const isSegmentStart = (): boolean => {
	const { isFirstDay, isLastDay } = segment() || {}
	return segment() && isFirstDay && !isLastDay
}
const isSegmentMiddle = (): boolean => {
	const { isFirstDay, isLastDay } = segment() || {}
	return segment() && !isFirstDay && !isLastDay
}
const isSegmentEnd = (): boolean => {
	const { isFirstDay, isLastDay } = segment() || {}
	return segment() && isLastDay && !isFirstDay
}
const allDayClass = () => {
	const { event } = props

	if (event.allDay) {
		return {
			'event-start': isSegmentStart(),
			'event-middle': isSegmentMiddle(),
			'event-end': isSegmentEnd(),
		}
	}
	return ''
}
</script>
<style lang="scss">
.vuecal__event {
	&.arrow-left {
		border-left-color: transparent;
		&:before {
			content: '';
			display: block;
			position: absolute;
			right: 100%;
			top: 50%;
			transform: translateY(-50%);
			margin-right: 0;
			border: 10px solid transparent;
			border-right-color: #f6f7f9;
		}
		&:hover {
			&:before {
				border-right-color: #f0f2f5;
			}
		}
		&.new-data {
			&:before {
				border-right-color: #ffefed;
			}
			&:hover {
				&:before {
					border-right-color: #ffe8e5;
				}
			}
		}
	}
	&.arrow-right {
		border-right-color: transparent;
		&:after {
			content: '';
			display: block;
			position: absolute;
			left: 100%;
			top: 50%;
			transform: translateY(-50%);
			margin-left: 0;
			border: 10px solid transparent;
			border-left-color: #f6f7f9;
		}
		&:hover {
			&:after {
				border-left-color: #f0f2f5;
			}
		}
		&.new-data {
			&:after {
				border-left-color: #ffefed;
			}
			&:hover {
				&:after {
					border-left-color: #ffe8e5;
				}
			}
		}
	}
}
</style>
