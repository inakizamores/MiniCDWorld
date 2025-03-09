import { jsPDF } from 'jspdf'
import { TemplateState } from '@features/template/templateSlice'
import { DIMENSIONS } from '@constants/dimensions'

// This augments the jsPDF type to include the polygon method
declare module 'jspdf' {
  interface jsPDF {
    polygon: (points: number[], style: string) => jsPDF;
  }
}

class PDFService {
  private createNewPDF() {
    // Create a new PDF with US Letter dimensions
    return new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    })
  }

  private drawImage(
    doc: jsPDF,
    imageDataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (!imageDataUrl) return

    // jsPDF expects base64 data without the data URL prefix
    const base64Data = imageDataUrl.split(',')[1]
    doc.addImage(base64Data, 'JPEG', x, y, width, height)
  }

  private drawCircle(
    doc: jsPDF,
    x: number,
    y: number,
    radius: number,
    filled: boolean = false
  ) {
    const pts = []
    const steps = 100 // More steps means smoother circle
    
    for (let theta = 0; theta < 2 * Math.PI; theta += (2 * Math.PI) / steps) {
      const xPos = x + radius * Math.cos(theta)
      const yPos = y + radius * Math.sin(theta)
      pts.push(xPos, yPos)
    }
    
    // Add the first point again to close the path
    pts.push(pts[0], pts[1])
    
    if (filled) {
      doc.setFillColor(0, 0, 0)
      doc.polygon(pts, 'F')
    } else {
      doc.setDrawColor(0, 0, 0)
      doc.polygon(pts, 'S')
    }
  }

  private drawCircularImage(
    doc: jsPDF,
    imageDataUrl: string,
    centerX: number,
    centerY: number,
    diameter: number,
    holeSize: number
  ) {
    if (!imageDataUrl) return
    
    // First add the circular image
    this.drawImage(
      doc, 
      imageDataUrl, 
      centerX - diameter / 2, 
      centerY - diameter / 2, 
      diameter, 
      diameter
    )
    
    // Then draw the center hole
    this.drawCircle(
      doc,
      centerX,
      centerY,
      holeSize / 2,
      true // filled black circle
    )
    
    // Draw outer circle (dotted line for cutting)
    doc.setDrawColor(0, 0, 0)
    doc.setLineDashPattern([1, 1], 0)
    this.drawCircle(
      doc,
      centerX,
      centerY,
      diameter / 2
    )
    doc.setLineDashPattern([], 0) // Reset line style
  }

  private async generateSingleCD(
    doc: jsPDF,
    templateData: TemplateState,
    startX: number,
    startY: number
  ) {
    const { images, albumTitle, artistName } = templateData
    
    // Calculate margins and spacing
    const margin = DIMENSIONS.COMPONENT_SPACING
    
    // 1. Draw Front Covers (side by side)
    if (images.frenteAfuera?.croppedImage) {
      this.drawImage(
        doc,
        images.frenteAfuera.croppedImage,
        startX,
        startY,
        DIMENSIONS.FRENTE_AFUERA.width,
        DIMENSIONS.FRENTE_AFUERA.height
      )
    }
    
    if (images.frenteDentro?.croppedImage) {
      this.drawImage(
        doc,
        images.frenteDentro.croppedImage,
        startX + DIMENSIONS.FRENTE_AFUERA.width,
        startY,
        DIMENSIONS.FRENTE_DENTRO.width,
        DIMENSIONS.FRENTE_DENTRO.height
      )
    }
    
    // 2. Draw CD Disc (with circular mask and hole)
    if (images.disco?.croppedImage) {
      const discCenterX = startX + DIMENSIONS.FRENTE_AFUERA.width + DIMENSIONS.FRENTE_DENTRO.width + margin + DIMENSIONS.DISCO.diameter / 2
      const discCenterY = startY + DIMENSIONS.DISCO.diameter / 2 + margin
      
      this.drawCircularImage(
        doc,
        images.disco.croppedImage,
        discCenterX,
        discCenterY,
        DIMENSIONS.DISCO.diameter,
        DIMENSIONS.DISCO.holeSize
      )
    }
    
    // 3. Draw Back Covers
    const backY = startY + DIMENSIONS.FRENTE_AFUERA.height + margin
    
    // Back Outside (Main + Side)
    if (images.traseraAfuera.main?.croppedImage) {
      this.drawImage(
        doc,
        images.traseraAfuera.main.croppedImage,
        startX,
        backY,
        DIMENSIONS.TRASERA_AFUERA.main.width,
        DIMENSIONS.TRASERA_AFUERA.main.height
      )
    }
    
    if (images.traseraAfuera.side?.croppedImage) {
      this.drawImage(
        doc,
        images.traseraAfuera.side.croppedImage,
        startX + DIMENSIONS.TRASERA_AFUERA.main.width,
        backY,
        DIMENSIONS.TRASERA_AFUERA.side.width,
        DIMENSIONS.TRASERA_AFUERA.side.height
      )
    }
    
    // Back Inside (Side + Main)
    if (images.traseraDentro.side?.croppedImage) {
      this.drawImage(
        doc,
        images.traseraDentro.side.croppedImage,
        startX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width,
        backY,
        DIMENSIONS.TRASERA_DENTRO.side.width,
        DIMENSIONS.TRASERA_DENTRO.side.height
      )
    }
    
    if (images.traseraDentro.main?.croppedImage) {
      this.drawImage(
        doc,
        images.traseraDentro.main.croppedImage,
        startX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width,
        backY,
        DIMENSIONS.TRASERA_DENTRO.main.width,
        DIMENSIONS.TRASERA_DENTRO.main.height
      )
    }
    
    // 4. Add text labels
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    
    if (albumTitle) {
      doc.text(albumTitle, startX, startY - 2, { align: 'left' })
    }
    
    if (artistName) {
      doc.text(artistName, startX, startY - 2 + 3, { align: 'left' })
    }
    
    // Add MiniCDWorld footer
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.text('Generated with MiniCDWorld', startX, backY + DIMENSIONS.TRASERA_AFUERA.main.height + 3)
  }

  public async generatePDF(templateData: TemplateState): Promise<Blob> {
    const doc = this.createNewPDF()
    const { cdsPerPage } = templateData
    
    // Get page dimensions and calculate margins
    const pageWidth = DIMENSIONS.US_LETTER.width
    const pageHeight = DIMENSIONS.US_LETTER.height
    const margin = DIMENSIONS.PAGE_MARGIN
    
    // Calculate available area
    const availWidth = pageWidth - 2 * margin
    const availHeight = pageHeight - 2 * margin
    
    // Calculate CD positions based on number per page
    const positions = []
    
    if (cdsPerPage === 1) {
      // Center the CD template in the page
      positions.push({
        x: margin + availWidth / 2 - DIMENSIONS.FRENTE_AFUERA.width,
        y: margin + availHeight / 2 - DIMENSIONS.FRENTE_AFUERA.height
      })
    } else if (cdsPerPage === 2) {
      // Place two CDs vertically
      const spacing = 20 // Space between CDs
      const totalHeight = 2 * (DIMENSIONS.FRENTE_AFUERA.height + DIMENSIONS.TRASERA_AFUERA.main.height + margin) + spacing
      
      const startY = margin + (availHeight - totalHeight) / 2
      
      positions.push({
        x: margin + availWidth / 2 - DIMENSIONS.FRENTE_AFUERA.width,
        y: startY
      })
      
      positions.push({
        x: margin + availWidth / 2 - DIMENSIONS.FRENTE_AFUERA.width,
        y: startY + DIMENSIONS.FRENTE_AFUERA.height + DIMENSIONS.TRASERA_AFUERA.main.height + margin + spacing
      })
    } else if (cdsPerPage === 3) {
      // Place three CDs, with two on top and one on bottom
      const spacing = 15
      
      positions.push({
        x: margin,
        y: margin
      })
      
      positions.push({
        x: margin + availWidth - 2 * DIMENSIONS.FRENTE_AFUERA.width - DIMENSIONS.DISCO.diameter - spacing,
        y: margin
      })
      
      positions.push({
        x: margin + availWidth / 2 - DIMENSIONS.FRENTE_AFUERA.width,
        y: margin + DIMENSIONS.FRENTE_AFUERA.height + DIMENSIONS.TRASERA_AFUERA.main.height + margin + spacing
      })
    }
    
    // Draw CDs at calculated positions
    for (const pos of positions) {
      await this.generateSingleCD(doc, templateData, pos.x, pos.y)
    }
    
    // Return the generated PDF as a blob
    return doc.output('blob')
  }
}

export default new PDFService() 