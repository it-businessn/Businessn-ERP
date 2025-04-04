"use client";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import "./hero.css";

const CirclePattern = () => {
	const rows = 15;
	const cols = 40;
	const circles = [];
	const baseSize = 13;
	const spacing = 42;
	const svgRef = useRef(null);

	const MAX_ACTIVE_CIRCLES = 25;
	const APPEAR_DURATION = 3.6;
	const DISAPPEAR_DURATION = 3.6;
	const ANIMATION_DELAY = 0.1;
	const CLUSTER_SIZE = 10;
	const CLUSTER_RADIUS = 2;

	const TOP_POINT_COL = 36;
	const LEFT_POINT_ROW = 15;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const centerX = col * spacing;
			const centerY = row * spacing;

			// Calculate diagonal blur based on a dynamic line equation
			const isBlurred = row < LEFT_POINT_ROW - (LEFT_POINT_ROW / TOP_POINT_COL) * col;

			circles.push(
				<g key={`${row}-${col}`} className="circle-group" data-row={row} data-col={col}>
					<circle
						cx={centerX}
						cy={centerY}
						r={baseSize}
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
						className={`text-black ${isBlurred ? "blurred-circle" : ""}`}
						opacity={isBlurred ? "0.001" : "0.03"}
					/>
					{!isBlurred && (
						<g className="pop-circle" opacity="0">
							<circle
								cx={centerX}
								cy={centerY}
								r={baseSize}
								fill="white"
								filter="url(#circleShadow)"
							/>
						</g>
					)}
				</g>,
			);
		}
	}

	useEffect(() => {
		const allPopCircles = document.querySelectorAll(".pop-circle");
		const activeCircles = new Set();

		const getNeighbors = (centerRow, centerCol) => {
			const neighbors = [];
			for (let row = -CLUSTER_RADIUS; row <= CLUSTER_RADIUS; row++) {
				for (let col = -CLUSTER_RADIUS; col <= CLUSTER_RADIUS; col++) {
					const newRow = centerRow + row;
					const newCol = centerCol + col;
					if (
						newRow >= 0 &&
						newRow < rows &&
						newCol >= 0 &&
						newCol < cols &&
						(row !== 0 || col !== 0)
					) {
						neighbors.push([newRow, newCol]);
					}
				}
			}
			return neighbors;
		};

		const animateCircle = (circle, delay = 0) => {
			if (activeCircles.has(circle)) return;
			activeCircles.add(circle);

			gsap
				.timeline({
					onComplete: () => {
						activeCircles.delete(circle);
					},
				})
				.to(circle, {
					duration: APPEAR_DURATION,
					opacity: 1,
					ease: "power2.out",
					delay: delay + Math.cos() * 0.1,
				})
				.to(circle, {
					duration: DISAPPEAR_DURATION,
					opacity: 0,
					ease: "power2.in",
					delay: 0.1,
				});
		};

		const animateCluster = (centerCircle) => {
			const group = centerCircle.closest(".circle-group");
			const row = parseInt(group.dataset.row);
			const col = parseInt(group.dataset.col);

			const neighbors = getNeighbors(row, col);
			const selectedNeighbors = neighbors
				.sort(() => Math.random() - 0.5)
				.slice(0, CLUSTER_SIZE - 1);

			animateCircle(centerCircle);
			selectedNeighbors.forEach((pos, index) => {
				const neighborCircle = document.querySelector(
					`.circle-group[data-row="${pos[0]}"][data-col="${pos[1]}"] .pop-circle`,
				);
				if (neighborCircle) {
					animateCircle(neighborCircle, 0.05 + index * 0.05);
				}
			});
		};

		const startClusterAnimations = () => {
			if (activeCircles.size < MAX_ACTIVE_CIRCLES) {
				const availableCircles = Array.from(allPopCircles).filter(
					(circle) => !activeCircles.has(circle),
				);

				if (availableCircles.length > 0) {
					const randomIndex = Math.floor(Math.random() * availableCircles.length);
					animateCluster(availableCircles[randomIndex]);
				}
			}
			gsap.delayedCall(ANIMATION_DELAY, startClusterAnimations);
		};

		startClusterAnimations();
	}, []);

	return (
		<svg
			ref={svgRef}
			className="absolute inset-0 w-full h-full z-0"
			style={{ minWidth: "100%", minHeight: "100%" }}
			viewBox={`0 0 ${cols * spacing} ${rows * spacing}`}
			preserveAspectRatio="xMidYMid slice"
		>
			<defs>
				<filter id="circleShadow">
					<feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
					<feOffset dx="0" dy="1" result="offsetblur" />
					<feFlood floodColor="black" floodOpacity="0.1" />
					<feComposite in2="offsetblur" operator="in" />
					<feMerge>
						<feMergeNode />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{circles}
		</svg>
	);
};

export default CirclePattern;
