import html2canvas from 'html2canvas';

export interface CapturedChart {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Captures a chart element as a PNG image
 */
export async function captureChart(elementId: string, chartName: string): Promise<CapturedChart | null> {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`Chart element not found: ${elementId}`);
      return null;
    }

    console.log(`📊 Capturing chart: ${chartName}`);

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Force all colors to be RGB/HEX in the cloned document
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const element = el as HTMLElement;
          const style = element.style;
          
          // Convert any lab() colors to fallback colors
          if (style.backgroundColor?.includes('lab(')) {
            style.backgroundColor = 'transparent';
          }
          if (style.color?.includes('lab(')) {
            style.color = '#ffffff';
          }
          if (style.borderColor?.includes('lab(')) {
            style.borderColor = '#06b6d4';
          }
        });
      }
    });

    const dataUrl = canvas.toDataURL('image/png');
    
    console.log(`✅ Chart captured: ${chartName} (${canvas.width}x${canvas.height})`);

    return {
      name: chartName,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.error(`❌ Error capturing chart ${chartName}:`, error);
    return null;
  }
}

/**
 * Captures multiple charts in sequence
 */
export async function captureMultipleCharts(
  charts: Array<{ id: string; name: string }>
): Promise<CapturedChart[]> {
  const capturedCharts: CapturedChart[] = [];

  for (const chart of charts) {
    const captured = await captureChart(chart.id, chart.name);
    if (captured) {
      capturedCharts.push(captured);
    }
    // Small delay between captures
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return capturedCharts;
}
