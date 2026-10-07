"""
POLAR EXPLORER — Realistic Seed Data Generator
Populates local SQLite database with 15 reports, 15 datasets, 15 publications, 25 media items, 10 activities.
Uses realistic Indian Polar Research context (NCPOR, Maitri, Bharati, Himadri, IndARC, Himansh).
"""
import asyncio
import uuid
import hashlib
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from database import engine, init_db, AsyncSessionLocal
from models import (
    ReportModel, DatasetModel, PublicationModel, MediaModel, ActivityDocumentModel, AuditLogModel,
    UploadStatus, ReviewStatus, MediaType
)
from storage import local_storage


def make_checksum(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select, func
        cnt = await db.scalar(select(func.count(ReportModel.id)))
        if cnt and cnt > 0:
            print("Database already has records. Skipping seed.")
            return

        print("Seeding POLAR EXPLORER repository database...")

        # ------------------------------------
        # 1. REPORTS (15 items)
        # ------------------------------------
        reports_data = [
            ("16th Indian Antarctic Expedition Scientific Report", "Comprehensive scientific summary of atmospheric, geological, and biological field observations carried out during IAE-16.", "NCPOR Research Team, Dr. R. Sengupta", "1997-11-15", "IAE-16", "Maitri", "expedition_reports", "PDF"),
            ("39th Indian Scientific Expedition to Antarctica (ISEA) Operations Report", "Annual operational report detailing logistics, station maintenance, and scientific accomplishments at Maitri & Bharati.", "Dr. M. Ravichandran, NCPOR Logistics Wing", "2020-04-10", "ISEA-39", "Bharati", "expedition_reports", "PDF"),
            ("Himadri Arctic Station Annual Meteorology & Environmental Study", "Micro-climate analysis and atmospheric trace gas measurements conducted at Ny-Ålesund, Svalbard.", "Dr. K. S. Rajan, Dr. P. V. S. Raju", "2021-08-22", "Arctic-2021", "Himadri", "climate_change", "PDF"),
            ("IndARC Sub-surface Mooring Mission Technical Report", "Technical analysis of oceanographic data recovered from India's underwater observatory in Kongsfjorden.", "Dr. B. K. Jena, Ocean Sciences Division", "2019-12-05", "Arctic-2019", "IndARC", "oceanography", "PDF"),
            ("Larsemann Hills Freshwater Lake Ecosystem Survey", "Limnological investigation of micro-algae and chemical constituents in coastal lakes near Bharati Station.", "Dr. S. R. Sharma, Aquatic Ecology Group", "2022-02-18", "ISEA-41", "Bharati", "marine_biology", "PDF"),
            ("Schirmacher Oasis Glacier Dynamics & Ice Velocity Assessment", "Satellite radar interferometry combined with ground GPS surveys to monitor ice flow rates.", "Dr. A. K. Meloth, Glaciology Group", "2018-09-30", "ISEA-37", "Maitri", "glaciology", "PDF"),
            ("Himansh High Altitude Himalayan Observatory Status Report", "Glacier mass balance and hydrological monitoring in Chandra basin, Lahaul-Spiti, Himachal Pradesh.", "Dr. Thamban Meloth, Cryosphere Team", "2023-01-14", "Himalaya-2022", "Himansh", "cryosphere", "PDF"),
            ("Southern Ocean Phytoplankton Blooming Dynamics Mission Report", "Biogeochemical observations along 40°S to 60°S ocean transect during SOE-IX.", "Dr. N. Anilkumar, Marine Biology Division", "2017-06-12", "SOE-09", "Maitri", "oceanography", "PDF"),
            ("Antarctic Stratospheric Ozone Layer Depletion & UV Solar Irradiance", "Spectroradiometer measurements of solar UV radiation during polar spring at Maitri station.", "Dr. S. K. Peshin, IMD Polar Cell", "2019-05-20", "ISEA-38", "Maitri", "atmospheric", "PDF"),
            ("Southern Ocean Biogeochemical Cycling Survey Report", "Carbon sink dynamics and ocean acidification trends in sub-Antarctic waters.", "Dr. V. K. Tiwari, Biogeochemistry Group", "2021-11-03", "SOE-11", "Bharati", "oceanography", "PDF"),
            ("Svalbard Fjords Sediment Traps & Carbon Flux Report", "Seasonal study of organic sediment accumulation rates in Krossfjorden and Kongsfjorden.", "Dr. C. P. Rajendran, Arctic Marine Group", "2020-09-17", "Arctic-2020", "Himadri", "geology", "PDF"),
            ("Polar Ionospheric TEC Anomalies During Solar Cycle 24", "GNSS receiver network data analysis from Maitri for geomagnetic storm monitoring.", "Dr. A. K. Gwal, Upper Atmospheric Science", "2016-12-01", "ISEA-35", "Maitri", "atmospheric", "PDF"),
            ("Larsemann Hills Crustal Evolution & Paleoproterozoic Geology", "Petrological analysis of charnockitic and granulitic rocks exposed around Prydz Bay.", "Dr. N. C. Pant, Geological Survey of India", "2015-03-25", "ISEA-34", "Bharati", "geology", "PDF"),
            ("Indo-Norwegian Joint Arctic Glaciology Expedition Technical Report", "Comparative glacier mass balance modeling between Svalbard and Western Himalayas.", "Dr. P. Srivastava, Dr. J. O. Hagen", "2022-10-08", "Arctic-2022", "Himadri", "glaciology", "PDF"),
            ("42nd Indian Scientific Expedition to Antarctica (ISEA-42) Progress Report", "Mid-expedition status report detailing 42nd batch field scientific tasks and infrastructure upgrades.", "Dr. Rahul Mohan, Field Director", "2023-03-31", "ISEA-42", "Bharati", "expedition_reports", "PDF"),
        ]

        for idx, (title, desc, authors, date_str, exp, stn, topic, doc_type) in enumerate(reports_data):
            dummy_content = f"DUMMY REPORT CONTENT FOR {title}\nAuthor: {authors}\nExpedition: {exp}\nDate: {date_str}"
            storage_meta = await local_storage.upload_file(f"report_{idx+1}.pdf", dummy_content.encode('utf-8'), "application/pdf", subfolder=f"reports/{exp}")
            report = ReportModel(
                id=str(uuid.uuid4()),
                title=title,
                description=desc,
                authors=authors,
                publication_date=date_str,
                expedition_id=exp,
                station_id=stn,
                research_topic_id=topic,
                document_type=doc_type,
                version=f"1.{idx%3}",
                language="English",
                license="CC BY 4.0",
                upload_status=UploadStatus.READY,
                review_status=ReviewStatus.APPROVED,
                file_name=storage_meta["file_name"],
                file_size=storage_meta["file_size"],
                mime_type=storage_meta["mime_type"],
                checksum=make_checksum(dummy_content + title),
                storage_key=storage_meta["storage_key"],
                is_latest_version=True
            )
            db.add(report)

        # ------------------------------------
        # 2. DATASETS (15 items)
        # ------------------------------------
        datasets_data = [
            ("Maitri Station Hourly Meteorology & Surface Wind Observations (2018-2023)", "POLAR-DS-2023-001", "Continuous hourly weather observations including wind speed, direction, temperature, and atmospheric pressure.", "IMD Polar Meteorology Cell", "2018-01-01", "2023-12-31", -70.76, -70.76, 11.73, 11.73, "CSV", "atmospheric"),
            ("Larsemann Hills Coastal Water Hydrographic Profiles (CTD Data)", "POLAR-DS-2022-014", "Conductivity-Temperature-Depth (CTD) profile cast data collected from Prydz Bay coastal region during ISEA-41.", "NCPOR Physical Oceanography Group", "2022-01-15", "2022-03-01", -69.45, -69.20, 75.80, 76.50, "CSV", "oceanography"),
            ("Kongsfjorden Mooring IndARC Time Series Oceanographic Dataset", "POLAR-DS-2021-088", "Multi-sensor time series data of salinity, ocean temperature, currents, and dissolved oxygen at 100m depth.", "Arctic Science Division, NCPOR", "2014-08-01", "2021-08-01", 78.90, 78.95, 11.80, 12.10, "JSON", "oceanography"),
            ("Antarctic Ice Sheet Surface Elevation & Ice Flow Velocity Vectors", "POLAR-DS-2020-109", "Derived satellite altimetry and interferometric synthetic aperture radar (InSAR) ice velocity grid for Dronning Maud Land.", "Glaciology Division, NCPOR", "2017-01-01", "2020-12-31", -72.00, -68.00, 8.00, 14.00, "ZIP", "glaciology"),
            ("Himansh Station Chhota Shigri Glacier Mass Balance & Ablation Rate Data", "POLAR-DS-2023-042", "Direct stake measurements of ice ablation, snow accumulation, and mass balance calculations for Western Himalayas.", "Himalayan Cryosphere Group", "2016-05-01", "2023-10-31", 32.20, 32.30, 77.45, 77.55, "XLSX", "cryosphere"),
            ("Schirmacher Oasis Lake Water Chemistry & Heavy Metal Concentrations", "POLAR-DS-2019-031", "Limnological dataset containing trace metal (Fe, Mn, Zn, Cu) concentrations across 24 freshwater lakes.", "Environmental Chemistry Wing", "2019-01-10", "2019-02-28", -70.78, -70.74, 11.60, 11.85, "CSV", "marine_biology"),
            ("Southern Ocean Surface Water CO2 Partial Pressure (pCO2) & pH", "POLAR-DS-2021-205", "Underway pCO2 instrument measurements onboard ORV Sagar Nidhi from 40°S to Antarctic coast.", "Biogeochemistry Group", "2021-01-05", "2021-02-25", -69.00, -40.00, 57.00, 77.00, "CSV", "oceanography"),
            ("Bharati Station Geomagnetic Pulsation & Magnetometer High-Rate Log", "POLAR-DS-2022-099", "10 Hz fluxgate magnetometer recordings of geomagnetic field fluctuations during auroral substorms.", "Indian Institute of Geomagnetism", "2022-01-01", "2022-12-31", -69.41, -69.41, 76.19, 76.19, "ZIP", "atmospheric"),
            ("Svalbard Kongsfjorden Suspended Particulate Matter (SPM) Distribution", "POLAR-DS-2020-077", "Spectrophotometric SPM concentration measurements from glacial meltwater inflow streams into Kongsfjorden.", "Arctic Marine Ecology Team", "2020-07-01", "2020-08-31", 78.90, 78.98, 11.70, 12.40, "CSV", "geology"),
            ("Southern Ocean Micro-Phytoplankton Taxa Abundance & Chlorophyll-a Grids", "POLAR-DS-2018-056", "Microscopic species identification logs and fluorometric Chlorophyll-a values from SOE-VIII transects.", "Biological Oceanography Group", "2018-02-01", "2018-03-20", -65.00, -45.00, 50.00, 70.00, "XLSX", "marine_biology"),
            ("Antarctic Marine Aerosol Size Distributions & Cloud Condensation Nuclei (CCN)", "POLAR-DS-2023-112", "Scanning Mobility Particle Sizer (SMPS) data collected continuously during ISEA-42 voyage.", "Atmospheric Aerosol Research Cell", "2022-12-15", "2023-03-15", -69.40, -15.00, 70.00, 76.00, "CSV", "climate_change"),
            ("Larsemann Hills Soil Bacterial 16S rRNA High-Throughput Gene Sequences", "POLAR-DS-2021-301", "Metagenomic sequencing dataset of cold-adapted microbial communities isolated from permafrost soils.", "Polar Biology & Biotechnology Wing", "2021-02-01", "2021-02-20", -69.42, -69.40, 76.10, 76.25, "ZIP", "marine_biology"),
            ("Svalbard Ny-Ålesund Black Carbon In-Situ Aerosol Optical Depth (AOD)", "POLAR-DS-2022-180", "Aethalometer measurements of black carbon concentrations and sunphotometer AOD over Himadri station.", "IMD / NCPOR Joint Cell", "2022-04-01", "2022-09-30", 78.92, 78.92, 11.93, 11.93, "CSV", "climate_change"),
            ("Chandra River Basin Seasonal Snow Cover Area (SCA) MODIS Time Series", "POLAR-DS-2023-088", "Daily 250m satellite-derived snow cover area percentage data covering Lahaul-Spiti catchment.", "Remote Sensing & GIS Cell", "2015-01-01", "2023-12-31", 32.10, 32.60, 77.10, 77.80, "ZIP", "remote_sensing"),
            ("Prydz Bay Sea Ice Thickness & Freeboard Measurements from CryoSat-2 Validation", "POLAR-DS-2022-440", "In-situ electromagnetic induction drill hole sea ice thickness measurements calibrated against radar satellite.", "Polar Remote Sensing Group", "2022-01-10", "2022-02-25", -68.80, -66.50, 72.00, 78.00, "CSV", "remote_sensing")
        ]

        for idx, (title, identifier, desc, org, s_date, e_date, lat_min, lat_max, lon_min, lon_max, fmt, topic) in enumerate(datasets_data):
            dummy_content = f"DATASET DUMMY CONTENT: {title}\nID: {identifier}\nFormat: {fmt}"
            mime_map = {"CSV": "text/csv", "JSON": "application/json", "XLSX": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ZIP": "application/zip"}
            storage_meta = await local_storage.upload_file(f"dataset_{idx+1}.{fmt.lower()}", dummy_content.encode('utf-8'), mime_map.get(fmt, "text/plain"), subfolder="datasets")
            dataset = DatasetModel(
                id=str(uuid.uuid4()),
                title=title,
                dataset_identifier=identifier,
                description=desc,
                authors="NCPOR Polar Science Team",
                organization=org,
                expedition_id=f"ISEA-{35 + (idx%8)}",
                station_id="Bharati" if idx%2==0 else "Maitri",
                research_topic_id=topic,
                measurement_type="Field Observation & Automated Sensor Log",
                start_date=s_date,
                end_date=e_date,
                latitude_min=lat_min,
                latitude_max=lat_max,
                longitude_min=lon_min,
                longitude_max=lon_max,
                format=fmt,
                license="CC BY 4.0",
                version="1.0",
                upload_status=UploadStatus.READY,
                review_status=ReviewStatus.APPROVED,
                file_name=storage_meta["file_name"],
                file_size=storage_meta["file_size"],
                mime_type=storage_meta["mime_type"],
                checksum=make_checksum(dummy_content + identifier),
                storage_key=storage_meta["storage_key"],
                is_latest_version=True
            )
            db.add(dataset)

        # ------------------------------------
        # 3. PUBLICATIONS (15 items)
        # ------------------------------------
        pubs_data = [
            ("Impact of Southern Ocean Warming on Antarctic Sea Ice Retreat: Observations and Model Projections", "Dr. N. Anilkumar, Dr. R. Mohan, Dr. M. Ravichandran", "Journal of Climate Cryosphere", "10.1016/j.jclimcryo.2023.104201", "Southern Ocean, Sea Ice, Climate Change, Warming, Antartica", "2023-05-14", "climate_change"),
            ("Bacterial Diversity and Heavy Metal Resistance Mechanisms in Antarctic Freshwater Lakes around Schirmacher Oasis", "Dr. S. R. Sharma, Dr. V. K. Tiwari", "Polar Biology", "10.1007/s00300-022-03011-w", "Metagenomics, Micro-algae, Limnology, Maitri, Schirmacher Oasis", "2022-11-20", "marine_biology"),
            ("Decadal Velocity Variations of Schirmacher Oasis Outlet Glaciers from SAR Interferometry", "Dr. A. K. Meloth, Dr. P. Srivastava", "IEEE Transactions on Geoscience and Remote Sensing", "10.1109/TGRS.2021.3115402", "InSAR, Glacier Flow, Dronning Maud Land, Ice Sheet", "2021-09-08", "glaciology"),
            ("First Multi-Year Oceanographic Time Series from IndARC Observatory in Kongsfjorden, Arctic", "Dr. B. K. Jena, Dr. K. S. Rajan", "Frontiers in Marine Science", "10.3389/fmars.2020.598210", "IndARC, Kongsfjorden, Svalbard, Ocean Mooring, Salinity", "2020-12-18", "oceanography"),
            ("Himalayan Mass Balance Response to Monsoonal and Westerly Precipitation at Himansh Observatory", "Dr. Thamban Meloth, Dr. A. K. Singh", "Annals of Glaciology", "10.1017/aog.2023.15", "Himalaya, Chhota Shigri, Glaciology, Mass Balance, Climate", "2023-02-28", "cryosphere"),
            ("Biogeochemical Drivers of Phytoplankton Bloom Dynamics in the Sub-Antarctic Front", "Dr. V. K. Tiwari, Dr. N. Anilkumar", "Deep Sea Research Part II: Topical Studies in Oceanography", "10.1016/j.dsr2.2021.104950", "Phytoplankton, SOE, Carbon Sink, Chlorophyll, Sub-Antarctic", "2021-04-12", "oceanography"),
            ("Geomagnetic Substorm Triggering Observed via High-Latitude Magnetometer at Bharati Station", "Dr. A. K. Gwal, Dr. S. K. Peshin", "Journal of Geophysical Research: Space Physics", "10.1029/2019JA027500", "Bharati, Magnetometer, Auroral Substorm, Space Weather", "2020-01-30", "atmospheric"),
            ("Petrology and Metamorphic P-T Evolution of Granulites from Larsemann Hills, East Antarctica", "Dr. N. C. Pant, Dr. S. K. Bhowmik", "Precambrian Research", "10.1016/j.precamres.2018.07.012", "Prydz Bay, Granulites, Charnockite, Crustal Evolution, Geology", "2018-08-15", "geology"),
            ("Black Carbon Transport to Arctic Ny-Ålesund and its Radiative Forcing Impact at Himadri", "Dr. S. K. Peshin, Dr. C. P. Rajendran", "Atmospheric Environment", "10.1016/j.atmosenv.2022.119102", "Black Carbon, Himadri, Svalbard, Aerosol Optical Depth", "2022-06-05", "climate_change"),
            ("Antarctic Marine Aerosol Cloud Condensation Nuclei Activation under Varying Meteorological Regimes", "Dr. M. Ravichandran, Dr. R. Mohan", "Atmospheric Chemistry and Physics", "10.5194/acp-21-8845-2021", "Aerosol, CCN, Maritime Antarctica, Cloud Microphysics", "2021-07-22", "atmospheric"),
            ("Metagenomic Profiling of Permafrost Soil Microbiota in the Vicinity of Bharati Station", "Dr. S. R. Sharma, Dr. P. V. S. Raju", "Microbial Ecology", "10.1007/s00248-023-02188-4", "Metagenomics, 16S rRNA, Permafrost, Prydz Bay, Microbes", "2023-03-10", "marine_biology"),
            ("Comparison of CryoSat-2 and Sentinel-3 Sea Ice Freeboard Estimates with In-Situ Antarctic Drills", "Dr. A. K. Meloth, Dr. B. K. Jena", "Remote Sensing of Environment", "10.1016/j.rse.2022.113290", "Sea Ice, Freeboard, CryoSat-2, Remote Sensing, Antarctica", "2022-10-14", "remote_sensing"),
            ("Trace Element Hydrochemistry of Freshwater Lakes in Schirmacher Oasis, Dronning Maud Land", "Dr. V. K. Tiwari, Dr. N. C. Pant", "Environmental Science and Pollution Research", "10.1007/s11356-019-06412-x", "Schirmacher Oasis, Trace Metals, Hydrochemistry, Maitri", "2019-11-02", "marine_biology"),
            ("Decadal Snow Cover Dynamics over the Chandra River Basin Using MODIS Time Series", "Dr. Thamban Meloth, Dr. A. K. Meloth", "Journal of the Indian Society of Remote Sensing", "10.1007/s12524-021-01452-y", "MODIS, Snow Cover, Himalaya, Himansh, GIS", "2021-12-01", "remote_sensing"),
            ("Polar Ocean Biogeochemical Carbon Export Fluxes: Insights from Krossfjorden Sediment Traps", "Dr. C. P. Rajendran, Dr. N. Anilkumar", "Marine Chemistry", "10.1016/j.marchem.2023.104288", "Sediment Trap, Carbon Flux, Svalbard, Oceanography, Arctic", "2023-04-18", "oceanography")
        ]

        for idx, (title, authors, journal, doi, kw, date_str, topic) in enumerate(pubs_data):
            dummy_content = f"PDF DUMMY CONTENT FOR PUBLICATION: {title}\nDOI: {doi}\nJournal: {journal}"
            storage_meta = await local_storage.upload_file(f"publication_{idx+1}.pdf", dummy_content.encode('utf-8'), "application/pdf", subfolder="publications")
            pub = PublicationModel(
                id=str(uuid.uuid4()),
                title=title,
                authors=authors,
                abstract=f"Abstract: {title}. This study investigates polar ecosystem dynamics and climate teleconnections based on field observations.",
                publication_date=date_str,
                journal=journal,
                doi=doi,
                keywords=kw,
                research_topic_id=topic,
                expedition_id=f"ISEA-{36+(idx%6)}",
                document_url=f"https://doi.org/{doi}",
                version="1.0",
                upload_status=UploadStatus.READY,
                review_status=ReviewStatus.APPROVED,
                file_name=storage_meta["file_name"],
                file_size=storage_meta["file_size"],
                mime_type=storage_meta["mime_type"],
                checksum=make_checksum(dummy_content + doi),
                storage_key=storage_meta["storage_key"],
                is_latest_version=True
            )
            db.add(pub)

        # ------------------------------------
        # 4. MEDIA (25 items)
        # ------------------------------------
        media_items = [
            ("Bharati Station Under Aurora Australis", "IMAGE", "A breathtaking view of India's Bharati Station in Larsemann Hills lit beneath vibrant green auroral curtains during polar night.", "2022-06-21", "Larsemann Hills, Antarctica", -69.41, 76.19, "Bharati", "ISEA-41", "atmospheric"),
            ("Maitri Station During Antarctic Blizzard", "IMAGE", "Heavy snowdrift and sub-zero blizzard winds engulfing Maitri station buildings in Schirmacher Oasis.", "2021-08-14", "Schirmacher Oasis, Antarctica", -70.76, 11.73, "Maitri", "ISEA-40", "atmospheric"),
            ("ORV Sagar Nidhi Breaking Sea Ice", "VIDEO", "High-definition footage of Indian ice-class research vessel ORV Sagar Nidhi breaking pack ice near Prydz Bay.", "2020-01-28", "Prydz Bay, Antarctica", -68.50, 75.00, "Bharati", "ISEA-39", "oceanography"),
            ("Himadri Arctic Station in Summer Sunlight", "IMAGE", "The iconic red timber buildings of India's Arctic station Himadri framed by snow-capped Svalbard peaks.", "2022-07-15", "Ny-Ålesund, Svalbard", 78.92, 11.93, "Himadri", "Arctic-2022", "climate_change"),
            ("IndARC Mooring Deployment in Kongsfjorden", "VIDEO", "Time-lapse video recording the precision deployment of India's deep-sea oceanographic observatory IndARC.", "2019-08-10", "Kongsfjorden, Svalbard", 78.90, 11.80, "IndARC", "Arctic-2019", "oceanography"),
            ("Glaciology Team Core Drilling on Chhota Shigri Glacier", "IMAGE", "Scientists operating ice core drilling equipment at 4,800m altitude at Himansh high-altitude station.", "2023-09-05", "Chandra Basin, Himalaya", 32.25, 77.50, "Himansh", "Himalaya-2023", "cryosphere"),
            ("Adélie Penguin Colony Near Bharati Coast", "IMAGE", "A bustling colony of Adélie penguins nesting along the rocky coastal outcrops of Larsemann Hills.", "2022-01-12", "Larsemann Hills, Antarctica", -69.40, 76.22, "Bharati", "ISEA-41", "marine_biology"),
            ("Weddell Seal Basking on Antarctic Fast Ice", "IMAGE", "Close-up photograph of a Weddell seal taking refuge on seasonal sea ice near Maitri station.", "2021-12-04", "Schirmacher Oasis, Antarctica", -70.70, 11.80, "Maitri", "ISEA-41", "marine_biology"),
            ("Spectacular Tabular Iceberg Drifting in Southern Ocean", "IMAGE", "A massive 10km-wide tabular iceberg calved off the Amery Ice Shelf drifting northward into open ocean.", "2020-02-18", "Southern Ocean", -65.20, 60.50, "Bharati", "SOE-10", "glaciology"),
            ("Launching Automated Weather Balloon at Maitri", "VIDEO", "IMD meteorologist launching a high-altitude radiosonde weather balloon into the Antarctic stratosphere.", "2022-03-25", "Maitri Station, Antarctica", -70.76, 11.73, "Maitri", "ISEA-41", "atmospheric"),
            ("Sub-surface Freshwater Lake Sampling in Schirmacher Oasis", "IMAGE", "Limnologists retrieving water column samples through a drilled ice hole in Lake Priyadarshini.", "2019-02-02", "Maitri Station, Antarctica", -70.75, 11.70, "Maitri", "ISEA-38", "marine_biology"),
            ("Helicopter Sling-Load Cargo Transfer to Station", "VIDEO", "Kamov-32 heavy helicopter transporting scientific equipment and supplies from vessel to Bharati station helipad.", "2021-01-16", "Larsemann Hills, Antarctica", -69.41, 76.19, "Bharati", "ISEA-40", "expedition_reports"),
            ("Aerial Drone View of Himansh Observatory", "VIDEO", "4K drone flyover showing the remote Himansh research station surrounded by Himalayan glaciers.", "2022-10-01", "Lahaul-Spiti, Himachal Pradesh", 32.22, 77.48, "Himansh", "Himalaya-2022", "cryosphere"),
            ("Midnight Sun Above Kongsfjorden Fjord", "IMAGE", "The breathtaking 24-hour midnight sun illuminating icebergs floating in Svalbard's Kongsfjorden.", "2021-06-21", "Ny-Ålesund, Svalbard", 78.93, 11.90, "Himadri", "Arctic-2021", "climate_change"),
            ("Geologists Collecting Granulite Rock Samples", "IMAGE", "NCPOR field geologists conducting structural mapping and hammer sampling on Prydz Bay nunataks.", "2018-01-22", "Larsemann Hills, Antarctica", -69.45, 76.30, "Bharati", "ISEA-37", "geology"),
            ("Snow Cruiser Vehicle Navigating Polar Ice Sheet", "IMAGE", "PistenBully track snow-cat pulling heavy sledge convoys across the Antarctic ice shelf.", "2020-11-30", "Maitri-Bharati Traverse Route", -70.10, 45.00, "Maitri", "ISEA-40", "expedition_reports"),
            ("Snow Petrel Nesting on Schirmacher Nunataks", "IMAGE", "Rare photograph of a pure white Snow Petrel guarding its nest in rocky crevices near Maitri.", "2022-12-08", "Schirmacher Oasis", -70.78, 11.65, "Maitri", "ISEA-42", "marine_biology"),
            ("Deploying Autonomous Argo Float in Sub-Antarctic Waters", "VIDEO", "Marine oceanographers casting an automated profiling Argo float into Southern Ocean currents.", "2021-02-14", "Southern Ocean (50°S)", -50.00, 57.50, "Bharati", "SOE-11", "oceanography"),
            ("Sunset Reflections over Lake Priyadarshini", "IMAGE", "Golden hour light reflected on the calm ice-free waters of Lake Priyadarshini near Maitri.", "2019-03-01", "Maitri Station", -70.76, 11.74, "Maitri", "ISEA-38", "climate_change"),
            ("Sampling Glacier Meltwater Streams in Svalbard", "IMAGE", "Researchers filtering sediment samples from glacial runoff near Crown Prince Glacier, Ny-Ålesund.", "2020-08-04", "Ny-Ålesund, Svalbard", 78.95, 12.05, "Himadri", "Arctic-2020", "geology"),
            ("High-Resolution Satellite Dish Array at Bharati Station", "IMAGE", "State-of-the-art satellite ground station antenna at Bharati connecting Indian polar scientists with ISRO hubs.", "2023-01-20", "Bharati Station", -69.41, 76.19, "Bharati", "ISEA-42", "remote_sensing"),
            ("Emperor Penguins Visiting Indian Expedition Vessel", "IMAGE", "A small group of inquisitive Emperor Penguins gathering near the ice-edge beside the research ship.", "2022-02-05", "Prydz Bay Fast Ice", -68.90, 74.80, "Bharati", "ISEA-41", "marine_biology"),
            ("Atmospheric Aerosol Sampler Tower at Himadri", "IMAGE", "Multi-stage optical particle counter and black carbon samplers installed on Himadri rooftop tower.", "2022-05-18", "Ny-Ålesund, Svalbard", 78.92, 11.93, "Himadri", "Arctic-2022", "climate_change"),
            ("Timelapse of Indian Flag Hoisting at Bharati Station", "VIDEO", "Ceremonial flag hoisting ceremony on Republic Day surrounded by pristine Antarctic snowscapes.", "2022-01-26", "Bharati Station, Antarctica", -69.41, 76.19, "Bharati", "ISEA-41", "expedition_reports"),
            ("Polar Glaciologists Measuring Crevasse Depth", "IMAGE", "Safety-harnessed glaciologists using ground-penetrating radar (GPR) to detect hidden crevasses.", "2021-11-12", "Dronning Maud Land Ice Sheet", -71.20, 12.50, "Maitri", "ISEA-41", "glaciology")
        ]

        for idx, (title, m_type, desc, c_date, loc, lat, lon, stn, exp, topic) in enumerate(media_items):
            ext = "jpg" if m_type == "IMAGE" else "mp4"
            mime = "image/jpeg" if m_type == "IMAGE" else "video/mp4"
            dummy_content = f"MEDIA DUMMY DATA FOR {title}\nType: {m_type}\nLocation: {loc}"
            storage_meta = await local_storage.upload_file(f"media_{idx+1}.{ext}", dummy_content.encode('utf-8'), mime, subfolder=f"media/{m_type.lower()}s")
            
            media = MediaModel(
                id=str(uuid.uuid4()),
                title=title,
                description=desc,
                media_type=MediaType.IMAGE if m_type == "IMAGE" else MediaType.VIDEO,
                capture_date=c_date,
                location=loc,
                latitude=lat,
                longitude=lon,
                station_id=stn,
                expedition_id=exp,
                research_topic_id=topic,
                creator="NCPOR Expedition Media Cell",
                license="CC BY 4.0",
                copyright="NCPOR / MoES, Govt of India",
                upload_status=UploadStatus.READY,
                review_status=ReviewStatus.APPROVED,
                file_name=storage_meta["file_name"],
                file_size=storage_meta["file_size"],
                mime_type=storage_meta["mime_type"],
                checksum=make_checksum(dummy_content + title),
                storage_key=storage_meta["storage_key"]
            )
            db.add(media)

        # ------------------------------------
        # 5. ACTIVITY DOCUMENTS (10 items)
        # ------------------------------------
        activities_data = [
            ("National Conference on Polar Sciences (NCPS-2023)", "Conferences", "Annual national symposium hosting over 200 climate scientists, oceanographers, and cryosphere experts at NCPOR Goa.", "2023-05-18", "NCPOR Complex, Vasco-da-Gama, Goa"),
            ("International Polar Day Public Outreach & School Science Workshop", "School outreach", "Interactive session and live video link connection with Maitri station for over 500 high school students.", "2022-10-24", "National Science Centre, New Delhi"),
            ("Specialized Polar Medicine & Extreme Environment Survival Training", "Training programs", "Mandatory pre-expedition medical screening and cold-weather survival training conducted in Auli, Uttarakhand.", "2022-09-10", "ITBP High Altitude Training Centre, Auli"),
            ("Indo-Arctic Bilateral Climate Workshop", "Workshops", "Joint scientific deliberations between NCPOR and Norwegian Polar Institute on fjord ecosystem changes.", "2021-11-15", "Fram Centre, Tromsø, Norway"),
            ("Exhibition on 40 Years of India's Antarctic Endeavours", "Exhibitions", "Public photo exhibition displaying rare historical artifacts from the first 1981 Antarctic expedition.", "2021-12-01", "India International Centre, New Delhi"),
            ("Himalayan Cryosphere & Water Security Public Lecture", "Public lectures", "Distinguished public talk delivered by lead glaciologists on Himalayan glacier retreat and downstream river security.", "2023-03-22", "IISc Bangalore Auditorium"),
            ("NCPOR Institutional Announcement: Launch of ISEA-43 Call for Proposals", "Institutional announcements", "Official announcement inviting scientific proposals from Indian universities and institutes for 43rd ISEA.", "2023-06-01", "NCPOR Goa / Online Portal"),
            ("Seminar on Space Weather Effects on High-Latitude Communication", "Seminars", "Technical seminar bringing together ionospheric physicists and ISRO satellite communications engineers.", "2022-04-14", "IIG Mumbai"),
            ("Polar Ocean Biogeochemistry Advanced Hands-On Laboratory Workshop", "Workshops", "Hands-on laboratory training on automated nutrient analyzer calibration and micro-algae culturing.", "2023-01-20", "NCPOR Marine Bio Laboratory, Goa"),
            ("Antarctic Day Special Seminar on Treaty Environmental Protection", "Seminars", "Legal and environmental awareness seminar discussing Madrid Protocol guidelines for Antarctic field operations.", "2022-12-01", "Goa University Auditorium")
        ]

        for idx, (title, cat, desc, date_str, loc) in enumerate(activities_data):
            dummy_content = f"ACTIVITY DOCUMENT DUMMY CONTENT: {title}"
            storage_meta = await local_storage.upload_file(f"activity_{idx+1}.pdf", dummy_content.encode('utf-8'), "application/pdf", subfolder="activities")
            activity = ActivityDocumentModel(
                id=str(uuid.uuid4()),
                title=title,
                activity_category=cat,
                description=desc,
                event_date=date_str,
                location=loc,
                organizer="NCPOR / MoES, Govt of India",
                document_type="Activity Brochure & Report",
                file_name=storage_meta["file_name"],
                file_size=storage_meta["file_size"],
                mime_type=storage_meta["mime_type"],
                checksum=make_checksum(dummy_content + title),
                storage_key=storage_meta["storage_key"]
            )
            db.add(activity)

        await db.commit()
        print("[SUCCESS] Database successfully seeded with realistic Indian Polar Explorer records!")


if __name__ == "__main__":
    asyncio.run(seed())
