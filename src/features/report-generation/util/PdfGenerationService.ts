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
      
      /* PDF에서만 보이는 요소 표시 */
      .print-only {
        display: block !important;
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
        imageTimeout: 30000, // 이미지 로딩 타임아웃 증가
        logging: true, // 디버깅을 위한 로깅 활성화
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
          
          // print-only 클래스를 가진 요소들을 표시
          const printOnly = clonedDoc.querySelectorAll('.print-only');
          printOnly.forEach(el => {
            (el as HTMLElement).style.display = 'block';
          });
          
          // 이미지 로딩 상태 확인
          const images = clonedDoc.querySelectorAll('img');
          console.log(`PDF 생성: ${images.length}개의 이미지 발견`);
          images.forEach((img, index) => {
            if (!img.complete) {
              console.log(`이미지 ${index + 1}가 아직 로드되지 않음: ${img.src}`);
            } else if (img.naturalWidth === 0) {
              console.log(`이미지 ${index + 1} 로드 실패: ${img.src}`);
              // 이미지 로드 실패 시 대체 이미지 표시
              img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItaW1hZ2UiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
            }
          });
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

      // 디버깅: 페이지 나누기 지점 로깅
      console.log('페이지 나누기 지점:', breakPoints);
      console.log('전체 캔버스 높이:', fullCanvas.height);

      for (let i = 0; i < breakPoints.length; i++) {
        const nextBreakPoint = breakPoints[i];
        const pageHeight = nextBreakPoint - currentY;

        // 페이지 높이가 너무 작으면 건너뛰지 않고 최소 높이 보장
        if (pageHeight <= 5) {
          console.log(`페이지 ${pageNumber + 1}의 높이가 너무 작음:`, pageHeight);
          continue;
        }

        console.log(`페이지 ${pageNumber + 1} 생성: ${currentY} ~ ${nextBreakPoint} (높이: ${pageHeight})`);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = pageHeight;

        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          // 캔버스 복사 시 정확한 위치에서 복사
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

          // 페이지 추가 시 정확한 위치와 크기로 추가
          pdf.addImage(pageImgData, 'JPEG', margins.left, margins.top, contentWidth, pdfPageHeight);
        }

        currentY = nextBreakPoint;
        pageNumber++;
      }

      // 마지막 페이지 추가 (남은 내용이 있는 경우)
      if (currentY < fullCanvas.height) {
        const remainingHeight = fullCanvas.height - currentY;
        console.log(`마지막 페이지 추가: ${currentY} ~ ${fullCanvas.height} (높이: ${remainingHeight})`);
        
        if (remainingHeight > 5) {  // 최소 높이 확인
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = fullCanvas.width;
          pageCanvas.height = remainingHeight;

          const pageCtx = pageCanvas.getContext('2d');
          if (pageCtx) {
            pageCtx.drawImage(
              fullCanvas,
              0,
              currentY,
              fullCanvas.width,
              remainingHeight,
              0,
              0,
              fullCanvas.width,
              remainingHeight
            );

            pdf.addPage();
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const pdfPageHeight = (remainingHeight * contentWidth) / fullCanvas.width;
            pdf.addImage(pageImgData, 'JPEG', margins.left, margins.top, contentWidth, pdfPageHeight);
          }
        }
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

    console.log('최대 페이지 픽셀 높이:', maxPagePixels);
    console.log('전체 캔버스 높이:', totalCanvasHeight);

    // 섹션 요소들을 찾습니다
    const sections = Array.from(element.querySelectorAll('h1, h2, h3, .mb-8, .bg-blue-50, .avoid-break'))
      .filter(Boolean);

    // 각 섹션의 위치와 높이 정보를 저장
    const sectionPositions: { element: Element; top: number; height: number; bottom: number; }[] = [];
    const elementRect = element.getBoundingClientRect();

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const relativeTop = (rect.top - elementRect.top) * scale;
      const height = rect.height * scale;
      const bottom = relativeTop + height;

      sectionPositions.push({
        element: section,
        top: relativeTop,
        height: height,
        bottom: bottom
      });
    });

    // 위치에 따라 정렬
    sectionPositions.sort((a, b) => a.top - b.top);
    
    console.log('섹션 수:', sectionPositions.length);
    
    // 균등한 페이지 분할 계산
    const breakPoints: number[] = [];
    let currentY = 0;
    
    while (currentY < totalCanvasHeight) {
      // 다음 이상적인 페이지 끝 위치
      let idealNextBreakPoint = Math.min(currentY + maxPagePixels, totalCanvasHeight);
      
      // 이상적인 지점 근처에서 가장 적합한 섹션 시작 지점 찾기
      let bestBreakPoint = idealNextBreakPoint;
      let minDistance = Number.MAX_VALUE;
      
      // 섹션 시작 지점 검사
      for (const section of sectionPositions) {
        // 현재 페이지 내에 있거나 바로 다음에 있는 섹션 시작 지점
        if (section.top > currentY && section.top <= idealNextBreakPoint + maxPagePixels * 0.2) {
          const distance = Math.abs(section.top - idealNextBreakPoint);
          
          // 이상적인 지점에 가장 가까운 섹션 시작 지점 선택
          if (distance < minDistance) {
            minDistance = distance;
            bestBreakPoint = section.top;
          }
        }
      }
      
      // 적절한 섹션 시작 지점을 찾지 못했다면 이상적인 지점 사용
      if (bestBreakPoint === idealNextBreakPoint || minDistance > maxPagePixels * 0.3) {
        bestBreakPoint = idealNextBreakPoint;
      }
      
      // 페이지 최소 높이 보장 (최대 높이의 30% 이상)
      if (bestBreakPoint - currentY < maxPagePixels * 0.3 && bestBreakPoint < totalCanvasHeight) {
        bestBreakPoint = Math.min(currentY + maxPagePixels, totalCanvasHeight);
      }
      
      // 페이지 최대 높이 제한 (최대 높이의 120% 이하)
      if (bestBreakPoint - currentY > maxPagePixels * 1.2) {
        bestBreakPoint = currentY + maxPagePixels;
      }
      
      // 마지막 페이지가 너무 작으면 이전 페이지와 합치기
      if (totalCanvasHeight - bestBreakPoint < maxPagePixels * 0.2 && breakPoints.length > 0) {
        break; // 마지막 페이지는 추가하지 않고 종료
      }
      
      breakPoints.push(bestBreakPoint);
      currentY = bestBreakPoint;
    }
    
    // 마지막 페이지가 추가되지 않았으면 전체 높이 추가
    if (breakPoints.length === 0 || breakPoints[breakPoints.length - 1] < totalCanvasHeight) {
      breakPoints.push(totalCanvasHeight);
    }
    
    console.log('계산된 페이지 나누기 지점:', breakPoints);
    return breakPoints;
  }
}
