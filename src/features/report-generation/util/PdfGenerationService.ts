import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default class PdfGenerationService {
  static applyPdfCompatibleStyles(element: HTMLElement): void {
    element.classList.add('pdf-mode');

    const style = document.createElement('style');
    style.id = 'pdf-compatibility-styles';
    style.textContent = `
      /* PDF 모드에서만 적용되는 hex 색상 */
      .pdf-mode .bg-gradient-to-r {
        background: linear-gradient(to right, #2563eb, #1d4ed8) !important;
        background-image: linear-gradient(to right, #2563eb, #1d4ed8) !important;
      }
      
      .pdf-mode .text-blue-600 { color: #2563eb !important; }
      .pdf-mode .text-blue-100 { color: #dbeafe !important; }
      .pdf-mode .text-blue-800 { color: #1e40af !important; }
      .pdf-mode .text-gray-800 { color: #1f2937 !important; }
      .pdf-mode .text-gray-600 { color: #4b5563 !important; }
      .pdf-mode .text-gray-700 { color: #374151 !important; }
      .pdf-mode .text-gray-500 { color: #6b7280 !important; }
      .pdf-mode .text-gray-400 { color: #9ca3af !important; }
      .pdf-mode .text-emerald-600 { color: #059669 !important; }
      .pdf-mode .text-orange-600 { color: #ea580c !important; }
      .pdf-mode .text-red-500 { color: #ef4444 !important; }
      .pdf-mode .text-white { color: #ffffff !important; }
      
      .pdf-mode .bg-blue-50 { background-color: #eff6ff !important; }
      .pdf-mode .bg-blue-500 { background-color: #3b82f6 !important; }
      .pdf-mode .bg-white { background-color: #ffffff !important; }
      
      .pdf-mode .border-blue-500 { border-color: #3b82f6 !important; }
      .pdf-mode .border-gray-200 { border-color: #e5e7eb !important; }
      
      /* 신용등급 차트 중앙 텍스트 위치 조정 (PDF 전용) */
      .pdf-mode .credit-rating-center {
        transform: translateY(-5px) !important;
      }
      
      .pdf-mode .credit-rating-main {
        margin-top: -14px !important;
      }
      
      .pdf-mode .credit-rating-sub {
        margin-top: 7px !important;
      }
      
      /* oklch나 최신 색상 함수 강제 오버라이드 */
      .pdf-mode [style*="oklch"],
      .pdf-mode [style*="lab("],
      .pdf-mode [style*="lch("],
      .pdf-mode [style*="color(display-p3"] {
        background: #ffffff !important;
        background-image: none !important;
        color: #000000 !important;
        border-color: #e5e7eb !important;
      }
    `;
    document.head.appendChild(style);
  }

  static removePdfCompatibleStyles(element: HTMLElement): void {
    element.classList.remove('pdf-mode');
    const style = document.getElementById('pdf-compatibility-styles');
    if (style) {
      style.remove();
    }
  }

  static async generateSmartPDF(
    elementToConvert: HTMLElement | null,
    fileName: string = 'report.pdf'
  ): Promise<boolean> {
    if (!elementToConvert) {
      console.error('PDF 생성을 위한 요소를 찾을 수 없습니다.');
      return false;
    }

    try {
      console.log('스마트 PDF 생성 중...');

      // 1. PDF 호환 모드 활성화
      this.applyPdfCompatibleStyles(elementToConvert);
      await new Promise(resolve => setTimeout(resolve, 100));

      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;
      const margins = { top: 15, bottom: 15, left: 15, right: 15 };
      const contentWidth = A4_WIDTH - margins.left - margins.right;
      const contentHeight = A4_HEIGHT - margins.top - margins.bottom;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // 2. 전체 콘텐츠를 한 번에 캡처
      const fullCanvas = await html2canvas(elementToConvert, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: elementToConvert.scrollWidth,
        height: elementToConvert.scrollHeight,
        onclone: (clonedDoc: Document) => {
          const noprint = clonedDoc.querySelectorAll('.no-print');
          noprint.forEach(el => el.remove());

          const reportContainer = clonedDoc.querySelector('.report-container');
          if (reportContainer) {
            reportContainer.classList.add('pdf-mode');
          }
        },
      });

      // 3. 페이지 나누기 포인트 찾기
      const breakPoints = await this.findOptimalBreakPoints(
        elementToConvert,
        contentHeight,
        fullCanvas.height
      );

      // 4. 각 페이지별로 캔버스 분할하여 PDF 생성
      let currentY = 0;
      let pageNumber = 0;

      for (let i = 0; i < breakPoints.length; i++) {
        const nextBreakPoint = breakPoints[i];
        const pageHeight = nextBreakPoint - currentY;

        if (pageHeight <= 0) {
          continue;
        }

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = pageHeight;

        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          pageCtx.drawImage(
            fullCanvas,
            0,
            currentY,
            fullCanvas.width,
            pageHeight,
            0,
            0,
            fullCanvas.width,
            pageHeight
          );

          if (pageNumber > 0) {
            pdf.addPage();
          }

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const pdfPageHeight = (pageHeight * contentWidth) / fullCanvas.width;

          pdf.addImage(pageImgData, 'JPEG', margins.left, margins.top, contentWidth, pdfPageHeight);
        }

        currentY = nextBreakPoint;
        pageNumber++;
      }

      pdf.save(fileName);
      console.log('스마트 PDF 생성 완료');
      return true;
    } catch (error) {
      console.error('스마트 PDF 생성 중 오류:', error);
      throw error;
    } finally {
      if (elementToConvert) {
        this.removePdfCompatibleStyles(elementToConvert);
      }
    }
  }

  private static async findOptimalBreakPoints(
    element: HTMLElement,
    maxPageHeight: number,
    totalCanvasHeight: number
  ): Promise<number[]> {
    const scale = 2;
    const maxPagePixels = maxPageHeight * scale * (element.scrollWidth / 180);

    const breakPoints: number[] = [];
    let currentY = 0;

    const sections = [
      element.querySelector('.bg-gradient-to-r'),
      element.querySelector('.bg-blue-50'),
      element.querySelector('.avoid-break'),
      ...Array.from(element.querySelectorAll('.mb-8')),
    ].filter(Boolean);

    const sectionPositions: { element: Element; top: number; height: number }[] = [];

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = (rect.top - elementRect.top) * scale;
      const height = rect.height * scale;

      sectionPositions.push({
        element: section,
        top: relativeTop,
        height: height,
      });
    });

    while (currentY < totalCanvasHeight) {
      let nextBreakPoint = Math.min(currentY + maxPagePixels, totalCanvasHeight);
      let bestBreakPoint = nextBreakPoint;
      let minPenalty = Infinity;

      for (const section of sectionPositions) {
        const sectionStart = section.top;
        const sectionEnd = section.top + section.height;

        if (sectionStart >= currentY && sectionStart <= nextBreakPoint) {
          if (sectionStart > currentY + maxPagePixels * 0.5) {
            const penalty = Math.abs(sectionStart - nextBreakPoint);
            if (penalty < minPenalty) {
              minPenalty = penalty;
              bestBreakPoint = sectionStart;
            }
          }
        }

        if (sectionStart < nextBreakPoint && sectionEnd > nextBreakPoint) {
          if (section.height < maxPagePixels * 0.8) {
            bestBreakPoint = Math.max(currentY + maxPagePixels * 0.3, sectionStart);
          } else {
            const middlePoint = sectionStart + section.height * 0.6;
            if (middlePoint > currentY + maxPagePixels * 0.4) {
              bestBreakPoint = middlePoint;
            }
          }
        }
      }

      bestBreakPoint = Math.max(bestBreakPoint, currentY + maxPagePixels * 0.3);
      breakPoints.push(bestBreakPoint);
      currentY = bestBreakPoint;
    }

    return breakPoints;
  }
}
