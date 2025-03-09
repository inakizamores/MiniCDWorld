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

// US Letter page size in millimeters
const US_LETTER_WIDTH = 215.9;
const US_LETTER_HEIGHT = 279.4;

// Convert mm to points (1 mm = 2.83465 points)
const mmToPoints = (mm: number) => mm * 2.83465;

// Default measurements based on the requirements
const defaultMeasurements: TemplateMeasurements = {
  pageSize: 'US-LETTER',
  pageDimensions: {
    width: US_LETTER_WIDTH,
    height: US_LETTER_HEIGHT
  },
  frenteAfuera: {
    width: 41,
    height: 41
  },
  frenteDentro: {
    width: 41,
    height: 41
  },
  disco: {
    diameter: 40,
    innerHole: 6
  },
  traseraAfuera: {
    height: 38,
    leftSection: {
      width: 50
    },
    rightSection: {
      width: 4
    }
  },
  traseraDentro: {
    height: 38,
    leftSection: {
      width: 4
    },
    rightSection: {
      width: 50
    }
  }
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: mmToPoints(10),
  },
  titleSection: {
    marginBottom: mmToPoints(10),
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
    color: '#555',
  },
  singleCDLayout: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'column'
  },
  twoCDLayout: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap'
  },
  threeCDLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  cdSection: {
    marginBottom: mmToPoints(25),
    paddingBottom: mmToPoints(5),
    borderBottom: '1pt dashed #CCC',
  },
  sectionTitle: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
    marginBottom: mmToPoints(3),
    marginTop: mmToPoints(5),
  },
  frenteSection: {
    flexDirection: 'row',
    marginBottom: mmToPoints(15),
  },
  frenteAfuera: {
    width: mmToPoints(41),
    height: mmToPoints(41),
    border: '1pt dashed #999',
    overflow: 'hidden',
  },
  frenteDentro: {
    width: mmToPoints(41),
    height: mmToPoints(41),
    border: '1pt dashed #999',
    overflow: 'hidden',
  },
  discoContainer: {
    alignItems: 'center',
    marginBottom: mmToPoints(15),
  },
  discoOuter: {
    width: mmToPoints(40),
    height: mmToPoints(40),
    borderRadius: mmToPoints(20),
    overflow: 'hidden',
    border: '1pt dashed #999',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  traseraSection: {
    flexDirection: 'row',
    marginBottom: mmToPoints(15),
  },
  traseraContainer: {
    flexDirection: 'row',
  },
  traseraAfueraLeft: {
    width: mmToPoints(50),
    height: mmToPoints(38),
    border: '1pt dashed #999',
    overflow: 'hidden',
  },
  traseraAfueraRight: {
    width: mmToPoints(4),
    height: mmToPoints(38),
    border: '1pt dashed #999',
    overflow: 'hidden',
  },
  traseraDentroLeft: {
    width: mmToPoints(4),
    height: mmToPoints(38),
    border: '1pt dashed #999',
    overflow: 'hidden',
  },
  traseraDentroRight: {
    width: mmToPoints(50),
    height: mmToPoints(38),
    border: '1pt dashed #999',
    overflow: 'hidden',
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: mmToPoints(5),
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
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
const CDTemplate = ({
  frenteAfuera,
  frenteDentro,
  disco,
  traseraAfueraLeft,
  traseraAfueraRight,
  traseraDentroLeft,
  traseraDentroRight,
  measurements = defaultMeasurements,
}: Partial<CDTemplateProps>) => (
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
      <View style={styles.discoOuter}>
        {disco && <Image src={disco} style={styles.image} />}
        <Svg width={mmToPoints(6)} height={mmToPoints(6)} style={{ position: 'absolute' }}>
          <Circle cx={mmToPoints(3)} cy={mmToPoints(3)} r={mmToPoints(3)} fill="black" />
        </Svg>
      </View>
      <Text style={styles.dimensionLabel}>40mm diameter with 6mm center hole</Text>
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

// Create the Document component
const CDTemplateDocument = ({
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
}: CDTemplateProps) => (
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

      {/* Footer */}
      <Text style={styles.footer}>
        Generated with CD Template Generator • {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

// Function to generate PDF blob URL
export const generatePDFBlob = async (props: CDTemplateProps): Promise<string> => {
  // This function would normally use the react-pdf renderer to create a blob
  // For demonstration purposes, we'll just return a placeholder
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would generate an actual PDF blob
      resolve('#generated-pdf-url');
    }, 2000);
  });
};

export default CDTemplateDocument; 