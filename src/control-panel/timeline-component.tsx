// Timeline Component 
// based on visx

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {theme} from '../theme';

import {GlyphCircle} from '@visx/glyph'
import {
  XYChart, GlyphSeries, Axis, Grid,
  Annotation, AnnotationCircleSubject, AnnotationLabel,
  BarSeries, AnnotationConnector, AnnotationLineSubject, Tooltip
} from '@visx/xychart';
import { Group } from '@visx/group';
// import { RenderTooltipParams } from "@visx/xychart/lib/components/Tooltip";

const accessors = {
  xAccessor: d => (d?.properties?.acquisitionDate && new Date(d?.properties?.acquisitionDate)) || null,
  yAccessor: d => 0, // d.y,
};

const handleRowHover = (e, searchResults, setFootprintFeatures) => {
  console.log( e)
  const rowIdx = parseInt(e.target.getAttribute('id'))
  const row = searchResults.output.features[rowIdx]
  // const rowId = e.target.parentElement.dataset.id;
  // const row = searchResults.output['features'].find(
  //   (el) => el.properties.id === rowId
  // );
  console.log(row)
  setFootprintFeatures(row)
};

// const getToolTipsDatum = (event: RenderTooltipParams<any>) => ({
//   datum: event?.tooltipData?.nearestDatum?.datum,
//   distance: event?.tooltipData?.nearestDatum?.distance
// });

function TimelineComponent(props) {
  return (
    <ThemeProvider theme={theme}>
        <div 
        className="control-panel" 
        style={{
          background: theme.palette.background.default,
          color: theme.palette.text.primary, 
          backgroundColor: 'transparent',
          width: '100%',

          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          outline: 'none',
          overflow: 'auto',
          pointerEvents: 'auto',
          alignSelf: 'flex-end'
        }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
          }}
        >
        {props.searchResults?.output?.features?.length > 0 &&
          <XYChart 
            captureEvents={false /* needed to avoid transparent rectangle requiring tooltip instead */ }
            height={110} 
            // xScale={{ type: 'time' }}  
            xScale={{ type: 'time', domain: [Date.parse(props.searchResults.input.properties.startDate), Date.parse(props.searchResults.input.properties.endDate)] }} //  
            yScale={{ type: "linear", domain: [0, 1], zero: false }}
          >

            <Axis orientation="bottom" />
            <Grid rows={false} columns={false} numTicks={4} />
            <Group pointerEvents="auto">
            <GlyphSeries 
              dataKey="Acquisition Dates" 
              data={props.searchResults.output['features']} 
              {...accessors} 
              renderGlyph={({ x, y, key  }: any) => ( //  { left: number; top: number }
                <GlyphCircle 
                  left={x} top={y}
                  stroke={'#777'} // theme.palette.primary.main}
                  fill={'#fff'}
                  strokeWidth={2}

                  // For handling Mouse Hover
                  id={ key }
                  onMouseEnter = {e => handleRowHover(e, props.searchResults, props.setFootprintFeatures)}
                  // onMouseLeave= {e => props.setFootprintFeatures({ coordinates: [],  type: 'Polygon' }) } 
                />
              )}
            />
            </Group>
            
            {/* Tooltip not working, only on a small subset of points - probable bug with XYChart and GlyphSeries and all points y=0 */}
            {/*
             <Tooltip
              snapTooltipToDatumX
              // snapTooltipToDatumY
              // showVerticalCrosshair
              // showSeriesGlyphs
              renderTooltip={({ tooltipData, colorScale }) => {
                console.log('YOYO')
                console.log(tooltipData)
                console.log(tooltipData.nearestDatum.key)
                console.log(accessors.xAccessor(tooltipData.nearestDatum.datum))
                console.log(tooltipData)
                props.setFootprintFeatures(tooltipData.nearestDatum.datum)

                return (
                  <div style={{
                      'display': 'none',
                      'visibility': 'hidden', 
                      'width': 0, 
                      'height': 0
                  }}>
                  </div>
                )
              }}
            /> */}

            {/* Annotation to show date */}
            <Group pointerEvents="none">
              {props.footprintFeatures && 
              <>
                <GlyphSeries 
                  dataKey="Selected Result" 
                  data={[props.footprintFeatures]} 
                  {...accessors} 
                  renderGlyph={({ x, y }: any) => ( 
                    <GlyphCircle 
                      left={x} top={y}
                      stroke={theme.palette.primary.main} // '#ff0000'} // 
                      fill={'#fff'}
                      strokeWidth={3}
                      size={100}
                      fillOpacity={1}
                    />
                  )}
                />
                <Annotation
                  dataKey={"Selected Result"}
                  datum={props.footprintFeatures}
                  dx={0}
                  dy={20} 
                >
                  <AnnotationCircleSubject 
                    stroke={'#000'}
                  />
                  <AnnotationLabel
                    title={`${accessors.xAccessor(props.footprintFeatures)?.toISOString().split('T')[0]}`}
                    subtitle={''}
                    width={135}
                    showAnchorLine={false}
                    backgroundProps={{
                      strokeWidth: 0,
                      strokeOpacity: 0,
                    }}
                  />
                </Annotation>
              </>
              }
            </Group>
            <Group id="test"></Group>
            
          </XYChart>
      }
        </div>
      </div>
    </ThemeProvider>
  );
}

export default React.memo(TimelineComponent);
