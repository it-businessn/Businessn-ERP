import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const GradientAreaFillColorChart = ({ data }) => {
	return (
		<ResponsiveContainer width="100%" height={250}>
			<AreaChart
				data={data}
				margin={{ top: 0, right: 0, left: -100, bottom: -30 }}
			>
				<defs>
					{/* <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="100%"
							stopColor="linear-gradient(104deg, rgba(219,229,255,1) 0%, rgba(196,247,216,1) 30%, rgba(201,235,242,1) 72%, rgba(255,228,225,1) 100%);"
							stopOpacity={0}
						/>
						<stop
							offset="100%"
							stopColor="linear-gradient(104deg, rgba(219,229,255,1) 0%, rgba(196,247,216,1) 30%, rgba(201,235,242,1) 72%, rgba(255,228,225,1) 100%);"
							stopOpacity={0}
						/>
					</linearGradient> */}
					<defs>
						<linearGradient
							id="colorGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop offset="0%" stopColor="#dbe5ff" stopOpacity={1} />
							<stop offset="30%" stopColor="#c4f7d8" stopOpacity={1} />
							<stop offset="72%" stopColor="#caeaf5" stopOpacity={1} />
							<stop offset="100%" stopColor="#ffe4e1" stopOpacity={1} />
						</linearGradient>
					</defs>
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke="#ccc" horizontal={false} />
				<XAxis dataKey="name" axisLine={false} tick={false} />
				<YAxis allowDecimals={false} axisLine={false} tick={false} />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="total"
					stroke="#4d7cb9"
					fill="url(#colorGradient)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export default GradientAreaFillColorChart;
