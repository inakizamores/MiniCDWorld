import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  Image, 
  StyleSheet, 
  PDFDownloadLink,
  Circle, 
  Svg
} from '@react-pdf/renderer';

// Define CD template measurements in millimeters
interface TemplateMeasurements {
  // Page size
  pageSize: string;
  pageDimensions: {
    width: number;
    height: number;
  };
  
  // Front section
  frenteAfuera: {
    width: number;
    height: number;
  };
  frenteDentro: {
    width: number;
    height: number;
  };
  
  // CD Label
  disco: {
    diameter: number;
    innerHole: number;
  };
  
  // Back section - now with separate sub-sections
  traseraAfuera: {
    height: number;
    leftSection: {
      width: number;
    };
    rightSection: {
      width: number;
    };
  };
  traseraDentro: {
    height: number;
    leftSection: {
      width: number;
    };
    rightSection: {
      width: number;
    };
  };
}

// Default measurements for CD templates (in mm)
const defaultMeasurements: TemplateMeasurements = {
  pageSize: 'LETTER',
  pageDimensions: {
    width: 215.9, // 8.5 inches in mm
    height: 279.4, // 11 inches in mm
  },
  frenteAfuera: {
    width: 41,
    height: 41,
  },
  frenteDentro: {
    width: 41,
    height: 41,
  },
  disco: {
    diameter: 40,
    innerHole: 6,
  },
  traseraAfuera: {
    height: 38,
    leftSection: {
      width: 50,
    },
    rightSection: {
      width: 4,
    },
  },
  traseraDentro: {
    height: 38,
    leftSection: {
      width: 4,
    },
    rightSection: {
      width: 50,
    },
  },
};

// Helper to convert mm to PDF points
const mmToPoints = (mm: number) => mm * 2.83465;

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: mmToPoints(10),
    backgroundColor: '#ffffff',
  },
  titleSection: {
    marginBottom: mmToPoints(10),
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: mmToPoints(5),
    marginTop: mmToPoints(10),
  },
  cdSection: {
    marginBottom: mmToPoints(15),
  },
  singleCDLayout: {
    alignItems: 'center',
  },
  twoCDLayout: {
    flexDirection: 'column',
    gap: mmToPoints(10),
  },
  threeCDLayout: {
    flexDirection: 'column',
    gap: mmToPoints(5),
  },
  frenteSection: {
    flexDirection: 'row',
    gap: mmToPoints(10),
    marginBottom: mmToPoints(5),
  },
  frenteAfuera: {
    width: mmToPoints(defaultMeasurements.frenteAfuera.width),
    height: mmToPoints(defaultMeasurements.frenteAfuera.height),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frenteDentro: {
    width: mmToPoints(defaultMeasurements.frenteDentro.width),
    height: mmToPoints(defaultMeasurements.frenteDentro.height),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoContainer: {
    alignItems: 'center',
    marginBottom: mmToPoints(5),
  },
  disco: {
    width: mmToPoints(defaultMeasurements.disco.diameter),
    height: mmToPoints(defaultMeasurements.disco.diameter),
    borderRadius: mmToPoints(defaultMeasurements.disco.diameter / 2),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  traseraSection: {
    gap: mmToPoints(10),
    marginBottom: mmToPoints(5),
  },
  traseraContainer: {
    flexDirection: 'row',
    marginBottom: mmToPoints(5),
  },
  traseraAfueraLeft: {
    width: mmToPoints(defaultMeasurements.traseraAfuera.leftSection.width),
    height: mmToPoints(defaultMeasurements.traseraAfuera.height),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  traseraAfueraRight: {
    width: mmToPoints(defaultMeasurements.traseraAfuera.rightSection.width),
    height: mmToPoints(defaultMeasurements.traseraAfuera.height),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  traseraDentroLeft: {
    width: mmToPoints(defaultMeasurements.traseraDentro.leftSection.width),
    height: mmToPoints(defaultMeasurements.traseraDentro.height),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  traseraDentroRight: {
    width: mmToPoints(defaultMeasurements.traseraDentro.rightSection.width),
    height: mmToPoints(defaultMeasurements.traseraDentro.height),
    border: '1pt dashed #cccccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
  },
  centerHole: {
    position: 'absolute',
  },
  dimensionLabel: {
    fontSize: 6,
    color: '#777', 
    marginTop: 2,
    textAlign: 'center',
  }
});

interface CDTemplateProps {
  albumTitle: string;
  artistName: string;
  releaseYear?: string;
  frenteAfuera?: string;
  frenteDentro?: string;
  disco?: string;
  traseraAfueraLeft?: string;
  traseraAfueraRight?: string;
  traseraDentroLeft?: string;
  traseraDentroRight?: string;
  numCDsPerPage: number;
  measurements?: TemplateMeasurements;
}

// Create a single CD template component
const CDTemplate: React.FC<Partial<CDTemplateProps>> = ({
  frenteAfuera,
  frenteDentro,
  disco,
  traseraAfueraLeft,
  traseraAfueraRight,
  traseraDentroLeft,
  traseraDentroRight,
  measurements = defaultMeasurements,
}) => {
  return (
    <View style={styles.cdSection}>
      {/* Front Covers Section (FRENTE_AFUERA and FRENTE_DENTRO) */}
      <Text style={styles.sectionTitle}>Front Cover Section</Text>
      <View style={styles.frenteSection}>
        <View>
          <View style={styles.frenteAfuera}>
            {frenteAfuera && <Image src={frenteAfuera} style={styles.image} />}
          </View>
          <Text style={styles.dimensionLabel}>41mm × 41mm</Text>
        </View>
        
        <View>
          <View style={styles.frenteDentro}>
            {frenteDentro && <Image src={frenteDentro} style={styles.image} />}
          </View>
          <Text style={styles.dimensionLabel}>41mm × 41mm</Text>
        </View>
      </View>
      
      {/* CD Label (DISCO) */}
      <Text style={styles.sectionTitle}>CD Label</Text>
      <View style={styles.discoContainer}>
        <View style={styles.disco}>
          {disco && <Image src={disco} style={styles.image} />}
          {/* Center hole */}
          <Svg width={mmToPoints(defaultMeasurements.disco.innerHole)} height={mmToPoints(defaultMeasurements.disco.innerHole)} style={styles.centerHole}>
            <Circle
              cx={mmToPoints(defaultMeasurements.disco.innerHole / 2)}
              cy={mmToPoints(defaultMeasurements.disco.innerHole / 2)}
              r={mmToPoints(defaultMeasurements.disco.innerHole / 2)}
              fill="white"
            />
          </Svg>
        </View>
        <Text style={styles.dimensionLabel}>40mm diameter, 6mm center hole</Text>
      </View>
      
      {/* Back Covers Section (TRASERA_AFUERA and TRASERA_ADENTRO) */}
      <Text style={styles.sectionTitle}>Back Cover Section</Text>
      <View style={styles.traseraSection}>
        {/* TRASERA_AFUERA with left and right sections */}
        <View style={styles.traseraContainer}>
          <View style={styles.traseraAfueraLeft}>
            {traseraAfueraLeft && <Image src={traseraAfueraLeft} style={styles.image} />}
          </View>
          <View style={styles.traseraAfueraRight}>
            {traseraAfueraRight && <Image src={traseraAfueraRight} style={styles.image} />}
          </View>
        </View>
        
        {/* TRASERA_DENTRO with left and right sections */}
        <View style={styles.traseraContainer}>
          <View style={styles.traseraDentroLeft}>
            {traseraDentroLeft && <Image src={traseraDentroLeft} style={styles.image} />}
          </View>
          <View style={styles.traseraDentroRight}>
            {traseraDentroRight && <Image src={traseraDentroRight} style={styles.image} />}
          </View>
        </View>
      </View>
      <Text style={styles.dimensionLabel}>TRASERA sections: 108mm × 38mm total width</Text>
    </View>
  );
};

// Create the Document component
const CDTemplateDocument: React.FC<CDTemplateProps> = ({
  albumTitle,
  artistName,
  releaseYear,
  frenteAfuera,
  frenteDentro,
  disco,
  traseraAfueraLeft,
  traseraAfueraRight,
  traseraDentroLeft,
  traseraDentroRight,
  numCDsPerPage = 1,
  measurements = defaultMeasurements,
}) => (
  <Document title={`${albumTitle} - CD Template`}>
    <Page size="LETTER" style={styles.page}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{albumTitle}</Text>
        <Text style={styles.subtitle}>
          {artistName} {releaseYear ? `(${releaseYear})` : ''}
        </Text>
      </View>

      {numCDsPerPage === 1 ? (
        <View style={styles.singleCDLayout}>
          <CDTemplate
            frenteAfuera={frenteAfuera}
            frenteDentro={frenteDentro}
            disco={disco}
            traseraAfueraLeft={traseraAfueraLeft}
            traseraAfueraRight={traseraAfueraRight}
            traseraDentroLeft={traseraDentroLeft}
            traseraDentroRight={traseraDentroRight}
            measurements={measurements}
          />
        </View>
      ) : numCDsPerPage === 2 ? (
        <View style={styles.twoCDLayout}>
          <CDTemplate
            frenteAfuera={frenteAfuera}
            frenteDentro={frenteDentro}
            disco={disco}
            traseraAfueraLeft={traseraAfueraLeft}
            traseraAfueraRight={traseraAfueraRight}
            traseraDentroLeft={traseraDentroLeft}
            traseraDentroRight={traseraDentroRight}
            measurements={measurements}
          />
          <CDTemplate
            frenteAfuera={frenteAfuera}
            frenteDentro={frenteDentro}
            disco={disco}
            traseraAfueraLeft={traseraAfueraLeft}
            traseraAfueraRight={traseraAfueraRight}
            traseraDentroLeft={traseraDentroLeft}
            traseraDentroRight={traseraDentroRight}
            measurements={measurements}
          />
        </View>
      ) : (
        <View style={styles.threeCDLayout}>
          <CDTemplate
            frenteAfuera={frenteAfuera}
            frenteDentro={frenteDentro}
            disco={disco}
            traseraAfueraLeft={traseraAfueraLeft}
            traseraAfueraRight={traseraAfueraRight}
            traseraDentroLeft={traseraDentroLeft}
            traseraDentroRight={traseraDentroRight}
            measurements={measurements}
          />
          <CDTemplate
            frenteAfuera={frenteAfuera}
            frenteDentro={frenteDentro}
            disco={disco}
            traseraAfueraLeft={traseraAfueraLeft}
            traseraAfueraRight={traseraAfueraRight}
            traseraDentroLeft={traseraDentroLeft}
            traseraDentroRight={traseraDentroRight}
            measurements={measurements}
          />
          <CDTemplate
            frenteAfuera={frenteAfuera}
            frenteDentro={frenteDentro}
            disco={disco}
            traseraAfueraLeft={traseraAfueraLeft}
            traseraAfueraRight={traseraAfueraRight}
            traseraDentroLeft={traseraDentroLeft}
            traseraDentroRight={traseraDentroRight}
            measurements={measurements}
          />
        </View>
      )}
    </Page>
  </Document>
);

// Function to generate PDF blob
export const generatePDFBlob = async (templateProps: CDTemplateProps): Promise<Blob> => {
  const { renderToStream } = await import('@react-pdf/renderer');
  const stream = await renderToStream(<CDTemplateDocument {...templateProps} />);
  
  // Convert stream to blob
  const chunks: Uint8Array[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(new Blob(chunks, { type: 'application/pdf' })));
    stream.on('error', reject);
  });
};

// Export a PDFDownloadLink wrapper component
export const CDTemplatePDFDownload: React.FC<{
  templateProps: CDTemplateProps;
  children: React.ReactNode;
}> = ({ templateProps, children }) => {
  return (
    <PDFDownloadLink
      document={<CDTemplateDocument {...templateProps} />}
      fileName={`${templateProps.albumTitle.replace(/\s+/g, '-').toLowerCase() || 'cd'}-template.pdf`}
    >
      {children}
    </PDFDownloadLink>
  );
}; 