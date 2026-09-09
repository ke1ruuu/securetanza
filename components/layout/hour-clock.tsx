"use client";

interface HourClockProps {
	/** Hour of day being inspected, 0–23. */
	hour: number;
	/** Rendered width/height in px. */
	size?: number;
	/** Accent colour for the hands and the day-progress arc. */
	accent?: string;
	/** Set false when an adjacent readout already states AM/PM. */
	showMeridiem?: boolean;
}

const CIRCUMFERENCE = 2 * Math.PI * 45;

/**
 * Analog clock face pinned to a whole hour, with an arc showing how far
 * through the 24-hour day that hour sits.
 */
export default function HourClock({ hour, size = 76, accent = "#0EA5E9", showMeridiem = true }: HourClockProps) {
	const safeHour = ((Math.trunc(hour) % 24) + 24) % 24;
	const hourAngle = (safeHour % 12) * 30;
	const dayProgress = safeHour / 24;
	const isPM = safeHour >= 12;

	return (
		<div className="relative flex-shrink-0" style={{ width: size, height: size }}>
			<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
				{/* Face */}
				<circle cx="50" cy="50" r="45" className="fill-slate-50 dark:fill-[#0F172A]" />
				<circle cx="50" cy="50" r="45" fill="none" strokeWidth="2" className="stroke-slate-200 dark:stroke-white/10" />

				{/* Day progress arc */}
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke={accent}
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeDasharray={CIRCUMFERENCE}
					strokeDashoffset={CIRCUMFERENCE * (1 - dayProgress)}
					transform="rotate(-90 50 50)"
					opacity={0.9}
					style={{ transition: "stroke-dashoffset 400ms cubic-bezier(0.4, 0, 0.2, 1)" }}
				/>

				{/* Hour ticks */}
				{Array.from({ length: 12 }, (_, i) => (
					<line
						key={i}
						x1="50"
						y1="14"
						x2="50"
						y2={i % 3 === 0 ? 21 : 18}
						strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
						strokeLinecap="round"
						transform={`rotate(${i * 30} 50 50)`}
						className={i % 3 === 0 ? "stroke-slate-400 dark:stroke-slate-500" : "stroke-slate-300 dark:stroke-slate-600"}
					/>
				))}

				{/* Minute hand — always on the hour, so fixed at 12 */}
				<line x1="50" y1="50" x2="50" y2="20" strokeWidth="2" strokeLinecap="round" className="stroke-slate-400 dark:stroke-slate-500" />

				{/* Hour hand */}
				<line
					x1="50"
					y1="52"
					x2="50"
					y2="30"
					strokeWidth="4"
					strokeLinecap="round"
					stroke={accent}
					style={{
						transform: `rotate(${hourAngle}deg)`,
						transformBox: "view-box",
						transformOrigin: "50% 50%",
						transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
					}}
				/>

				<circle cx="50" cy="50" r="3.5" fill={accent} />
				<circle cx="50" cy="50" r="1.5" className="fill-white dark:fill-[#0F172A]" />
			</svg>

			{/* AM/PM badge */}
			{showMeridiem && (
				<span
					className="absolute left-1/2 -translate-x-1/2 rounded-full px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.06]"
					style={{ bottom: size * 0.13 }}>
					{isPM ? "PM" : "AM"}
				</span>
			)}
		</div>
	);
}
