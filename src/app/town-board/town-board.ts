import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-town-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.viewBox]="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full select-none"
      (mouseleave)="resetHighlights()"
    >
      <!-- BACKGROUND -->
      <rect
        id="grass"
        [attr.x]="background.x"
        [attr.y]="background.y"
        [attr.width]="background.width"
        [attr.height]="background.height"
        class="fill-green-700"
      />

      <!-- ROADS -->
      <g id="roads">
        <!-- Vertical major road (4 lanes) - MOVED 50px RIGHT -->
        <rect
          class="road"
          [attr.x]="roads.vertical.x"
          [attr.y]="roads.vertical.y"
          [attr.width]="roads.vertical.width"
          [attr.height]="roads.vertical.height"
          [class.highlighted]="hoveredRoad === 'vertical'"
          (mouseenter)="onRoadHover('vertical')"
          class="fill-gray-800 stroke-2 stroke-gray-900 cursor-pointer transition-all duration-300"
          [class.fill-gray-700]="hoveredRoad === 'vertical'"
        />

        <!-- Horizontal minor road (3 lanes) - EXTENDED 100px LEFT -->
        <rect
          class="road"
          [attr.x]="roads.horizontal.x"
          [attr.y]="roads.horizontal.y"
          [attr.width]="roads.horizontal.width"
          [attr.height]="roads.horizontal.height"
          [class.highlighted]="hoveredRoad === 'horizontal'"
          (mouseenter)="onRoadHover('horizontal')"
          class="fill-gray-800 stroke-2 stroke-gray-900 cursor-pointer transition-all duration-300"
          [class.fill-gray-700]="hoveredRoad === 'horizontal'"
        />
      </g>

      <!-- CENTRAL RESERVE (VERTICAL ROAD) - ADJUSTED FOR RIGHT SHIFT -->
      <g id="central-reserve" [attr.mask]="'url(#roundabout-mask)'">
        <rect
          [attr.x]="centralReserve.vertical.x"
          [attr.y]="centralReserve.vertical.y"
          [attr.width]="centralReserve.vertical.width"
          [attr.height]="centralReserve.vertical.height"
          class="fill-green-700"
        />
        <line
          [attr.x1]="centralReserve.vertical.x"
          y1="0"
          [attr.x2]="centralReserve.vertical.x"
          y2="1700"
          class="stroke-yellow-500 stroke-[4]"
        />
        <line
          [attr.x1]="centralReserve.vertical.x + 20"
          y1="0"
          [attr.x2]="centralReserve.vertical.x + 20"
          y2="1700"
          class="stroke-yellow-500 stroke-[4]"
        />
      </g>

      <!-- CENTRAL RESERVE (HORIZONTAL ROAD) -->
      <g id="central-reserve-horizontal" [attr.mask]="'url(#roundabout-mask)'">
        <rect
          x="-500"
          [attr.y]="centralReserve.horizontal.y"
          width="1500"
          [attr.height]="centralReserve.horizontal.height"
          class="fill-green-700"
        />
        <line
          x1="-300"
          [attr.y1]="centralReserve.horizontal.y"
          x2="1200"
          [attr.y2]="centralReserve.horizontal.y"
          class="stroke-yellow-500 stroke-[4]"
        />
        <line
          x1="-300"
          [attr.y1]="centralReserve.horizontal.y + 20"
          x2="1200"
          [attr.y2]="centralReserve.horizontal.y + 20"
          class="stroke-yellow-500 stroke-[4]"
        />
      </g>

      <!-- ROUNDABOUT - ADJUSTED FOR RIGHT SHIFT -->
      <g
        id="roundabout"
        [attr.transform]="
          'translate(' + roundabout.transform.x + ' ' + roundabout.transform.y + ')'
        "
      >
        <circle
          class="roundabout-outer"
          [attr.cx]="roundabout.center.x"
          [attr.cy]="roundabout.center.y"
          [attr.r]="roundabout.outerRadius"
          (mouseenter)="onRoundaboutHover()"
          (mouseleave)="onRoundaboutLeave()"
          [class.highlighted]="hoveredRoundabout"
          class="fill-gray-800 stroke-2 stroke-gray-900 cursor-pointer transition-all duration-300"
          [class.fill-gray-700]="hoveredRoundabout"
        />

        <circle
          class="roundabout-lane"
          [attr.cx]="roundabout.center.x"
          [attr.cy]="roundabout.center.y"
          [attr.r]="210"
          (mouseenter)="onLaneHover('outer')"
          (mouseleave)="onLaneLeave()"
          [class.opacity-100]="hoveredLane === 'outer'"
          class="fill-none stroke-white stroke-[8] stroke-dasharray-[30,15] opacity-70 cursor-pointer transition-all duration-300"
        />

        <circle
          class="roundabout-lane"
          [attr.cx]="roundabout.center.x"
          [attr.cy]="roundabout.center.y"
          [attr.r]="150"
          (mouseenter)="onLaneHover('middle')"
          (mouseleave)="onLaneLeave()"
          [class.opacity-100]="hoveredLane === 'middle'"
          class="fill-none stroke-white stroke-[8] stroke-dasharray-[20,10] opacity-70 cursor-pointer transition-all duration-300"
        />

        <circle
          class="roundabout-lane"
          [attr.cx]="roundabout.center.x"
          [attr.cy]="roundabout.center.y"
          [attr.r]="90"
          (mouseenter)="onLaneHover('inner')"
          (mouseleave)="onLaneLeave()"
          [class.opacity-100]="hoveredLane === 'inner'"
          class="fill-none stroke-white stroke-[8] stroke-dasharray-[10,5] opacity-70 cursor-pointer transition-all duration-300"
        />

        <circle
          class="roundabout-inner"
          [attr.cx]="roundabout.center.x"
          [attr.cy]="roundabout.center.y"
          [attr.r]="roundabout.innerRadius"
          class="fill-gray-800 stroke-2 stroke-gray-900"
        />
      </g>

      <!-- DEFS -->
      <defs>
        <mask id="roundabout-mask">
          <rect x="0" y="0" width="1000" height="1800" fill="white" />
          <circle
            [attr.cx]="roundabout.mask.center.x"
            [attr.cy]="roundabout.mask.center.y"
            r="220"
            fill="black"
          />
          <rect x="565" y="900" width="50" height="90" fill="black" />
          <rect x="565" y="1350" width="50" height="90" fill="black" />
        </mask>

        <!-- ARROW DEFINITIONS -->
        <g id="arrow-straight">
          <line x1="0" y1="20" x2="0" y2="-20" class="stroke-white stroke-[6]" />
          <polygon points="-8,-18 8,-18 0,-30" class="fill-white" />
        </g>

        <g id="arrow-left">
          <line x1="0" y1="20" x2="0" y2="-5" class="stroke-white stroke-[6]" />
          <path d="M0 -5 Q0 -25 -20 -25" fill="none" class="stroke-white stroke-[6]" />
          <polygon points="-28,-25 -14,-18 -14,-32" class="fill-white" />
        </g>

        <g id="arrow-left-straight">
          <line x1="0" y1="26" x2="0" y2="-10" class="stroke-white stroke-[6]" />
          <polygon points="-8,-18 8,-20 0,-40" class="fill-white" />
          <line x1="0" y1="20" x2="0" y2="-5" class="stroke-white stroke-[6]" />
          <path d="M0 -5 Q0 -25 -20 -25" fill="none" class="stroke-white stroke-[6]" />
          <polygon points="-28,-25 -14,-18 -14,-32" class="fill-white" />
        </g>

        <g id="arrow-right-straight">
          <line x1="0" y1="26" x2="0" y2="-10" class="stroke-white stroke-[6]" />
          <polygon points="-8,-18 8,-20 0,-40" class="fill-white" />
          <line x1="0" y1="20" x2="0" y2="-5" class="stroke-white stroke-[6]" />
          <path d="M0 -5 Q0 -25 20 -25" fill="none" class="stroke-white stroke-[6]" />
          <polygon points="28,-25 14,-18 14,-32" class="fill-white" />
        </g>

        <g id="arrow-right">
          <line x1="0" y1="20" x2="0" y2="-5" class="stroke-white stroke-[6]" />
          <path d="M0 -5 Q0 -25 20 -25" fill="none" class="stroke-white stroke-[6]" />
          <polygon points="28,-25 14,-18 14,-32" class="fill-white" />
        </g>
      </defs>

      <!-- LANE ARROWS - ADJUSTED FOR RIGHT SHIFT -->
      <g id="lane-arrows" [attr.mask]="'url(#roundabout-mask)'">
        <!-- LEFT SIDE LANES -->
        <ng-container *ngFor="let arrow of laneArrows">
          <use
            [attr.href]="arrow.href"
            [attr.x]="arrow.x"
            [attr.y]="arrow.y"
            (mouseenter)="onArrowHover(arrow)"
            (mouseleave)="onArrowLeave()"
            [class.animate-pulse]="hoveredArrow === arrow.id"
            class="cursor-pointer transition-transform duration-300"
            [class.scale-125]="hoveredArrow === arrow.id"
          />
        </ng-container>
      </g>

      <!-- LANE MARKINGS - ADJUSTED FOR RIGHT SHIFT -->
      <g id="lane-markings" [attr.mask]="'url(#roundabout-mask)'">
        <!-- Vertical road lane dividers -->
        <ng-container *ngFor="let divider of laneDividers">
          <line
            [attr.x1]="divider.x1"
            [attr.y1]="divider.y1"
            [attr.x2]="divider.x2"
            [attr.y2]="divider.y2"
            class="stroke-white stroke-[4] stroke-dasharray-[40,20]"
          />
        </ng-container>
      </g>

      <!-- TOOLTIPS -->
      <g *ngIf="showTooltip && tooltipText">
        <rect
          [attr.x]="tooltipPosition.x - 60"
          [attr.y]="tooltipPosition.y - 40"
          width="120"
          height="30"
          rx="5"
          class="fill-gray-900/90"
        />
        <text
          [attr.x]="tooltipPosition.x"
          [attr.y]="tooltipPosition.y - 20"
          text-anchor="middle"
          class="fill-white text-sm font-semibold"
        >
          {{ tooltipText }}
        </text>
      </g>
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class TownBoardComponent {
  // ViewBox configuration
  viewBox = '-200 0 1200 1500';

  // Background configuration
  background = {
    x: -700,
    y: 0,
    width: 1700,
    height: 1500,
  };

  // Roads configuration
  roads = {
    vertical: {
      x: 430, // MOVED 50px RIGHT (from 380 to 430)
      y: 0,
      width: 450,
      height: 1600,
    },
    horizontal: {
      x: -200, // EXTENDED 100px LEFT (from 0 to -100)
      y: 360,
      width: 1400, // INCREASED width by 100px to compensate for left extension
      height: 330,
    },
  };

  // Central reserve configuration - ADJUSTED FOR RIGHT SHIFT
  centralReserve = {
    vertical: {
      x: 640, // MOVED 50px RIGHT (from 590 to 640)
      y: 0,
      width: 20,
      height: 1700,
    },
    horizontal: {
      y: 510,
      height: 20,
    },
  };

  // Roundabout configuration - ADJUSTED FOR RIGHT SHIFT
  roundabout = {
    transform: {
      x: 150, // MOVED 50px RIGHT (from 100 to 150)
      y: 28,
    },
    center: {
      x: 500,
      y: 500,
    },
    outerRadius: 20,
    innerRadius: 20,
    mask: {
      center: {
        x: 650, // MOVED 50px RIGHT (from 600 to 650)
        y: 530,
      },
    },
  };

  // Lane arrows configuration - ADJUSTED FOR RIGHT SHIFT
  laneArrows = [
    {
      id: 'left-straight-1',
      href: '#arrow-left-straight',
      x: 457, // MOVED 50px RIGHT (from 407 to 457)
      y: 750,
      label: 'Left/Straight Lane',
    },
    { 
      id: 'straight-1', 
      href: '#arrow-straight', 
      x: 510, // MOVED 50px RIGHT (from 460 to 510)
      y: 770, 
      label: 'Straight Lane' 
    },
    {
      id: 'right-straight-1',
      href: '#arrow-right-straight',
      x: 560, // MOVED 50px RIGHT (from 510 to 560)
      y: 810,
      label: 'Right/Straight Lane',
    },
    { 
      id: 'right-1', 
      href: '#arrow-right', 
      x: 610, // MOVED 50px RIGHT (from 560 to 610)
      y: 830, 
      label: 'Right Turn Only' 
    },
    { 
      id: 'right-2', 
      href: '#arrow-right', 
      x: 610, // MOVED 50px RIGHT (from 560 to 610)
      y: 830, 
      label: 'Right Turn Only' 
    },
  ];

  // Lane dividers configuration - ADJUSTED FOR RIGHT SHIFT
  laneDividers = [
    { x1: 484, y1: 0, x2: 484, y2: 1600 }, // MOVED 50px RIGHT (434 → 484)
    { x1: 538, y1: 0, x2: 538, y2: 1600 }, // MOVED 50px RIGHT (488 → 538)
    { x1: 592, y1: 0, x2: 592, y2: 1600 }, // MOVED 50px RIGHT (542 → 592)
    { x1: 710, y1: 0, x2: 710, y2: 1600 }, // MOVED 50px RIGHT (660 → 710)
    { x1: 770, y1: 0, x2: 770, y2: 1600 }, // MOVED 50px RIGHT (720 → 770)
    { x1: 826, y1: 0, x2: 826, y2: 1600 }, // MOVED 50px RIGHT (776 → 826)
    { x1: -200, y1: 400, x2: 1200, y2: 400 }, // Horizontal dividers remain same
    { x1: -200, y1: 460, x2: 1200, y2: 460 },
    { x1: -200, y1: 570, x2: 1200, y2: 570 },
    { x1: -200, y1: 630, x2: 1200, y2: 630 },
  ];

  // Interactive state
  hoveredRoad: 'vertical' | 'horizontal' | null = null;
  hoveredRoundabout = false;
  hoveredLane: 'outer' | 'middle' | 'inner' | null = null;
  hoveredArrow: string | null = null;

  // Tooltip state
  showTooltip = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  // Event handlers
  onRoadHover(road: 'vertical' | 'horizontal') {
    this.hoveredRoad = road;
    this.showTooltip = true;
    this.tooltipText = road === 'vertical' ? 'Major Road (4 lanes)' : 'Minor Road (3 lanes)';
    this.tooltipPosition = road === 'vertical' ? { x: 650, y: 400 } : { x: 500, y: 300 }; // Adjusted for right shift
  }

  onRoundaboutHover() {
    this.hoveredRoundabout = true;
    this.showTooltip = true;
    this.tooltipText = 'Roundabout (4 lanes)';
    this.tooltipPosition = { x: 650, y: 530 }; // Adjusted for right shift
  }

  onRoundaboutLeave() {
    this.hoveredRoundabout = false;
    if (!this.hoveredLane && !this.hoveredArrow) {
      this.showTooltip = false;
    }
  }

  onLaneHover(lane: 'outer' | 'middle' | 'inner') {
    this.hoveredLane = lane;
    this.showTooltip = true;
    this.tooltipText = `${lane.charAt(0).toUpperCase() + lane.slice(1)} Lane`;
    this.tooltipPosition = { x: 650, y: 530 }; // Adjusted for right shift
  }

  onLaneLeave() {
    this.hoveredLane = null;
    if (!this.hoveredRoundabout && !this.hoveredArrow) {
      this.showTooltip = false;
    }
  }

  onArrowHover(arrow: any) {
    this.hoveredArrow = arrow.id;
    this.showTooltip = true;
    this.tooltipText = arrow.label;
    this.tooltipPosition = { x: arrow.x, y: arrow.y - 50 };
  }

  onArrowLeave() {
    this.hoveredArrow = null;
    if (!this.hoveredRoundabout && !this.hoveredLane) {
      this.showTooltip = false;
    }
  }

  resetHighlights() {
    this.hoveredRoad = null;
    this.hoveredRoundabout = false;
    this.hoveredLane = null;
    this.hoveredArrow = null;
    this.showTooltip = false;
  }

  // Optional: Method to toggle lane markings animation
  toggleLaneAnimations() {
    const lanes = document.querySelectorAll('.roundabout-lane');
    lanes.forEach((lane) => {
      if (lane.classList.contains('animate-dash')) {
        lane.classList.remove('animate-dash');
      } else {
        lane.classList.add('animate-dash');
      }
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.resetHighlights();
  }
}