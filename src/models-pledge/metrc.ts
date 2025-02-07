
const { base64encode, base64decode } = require('nodejs-base64');
import fetch from 'node-fetch';
import dotenv from "dotenv";
import { PackageStatus, TransferType } from "@prisma/client";
dotenv.config()
const metrcApiEndpoint = 'https://api-ok.metrc.com/'
const vendor_key = process.env.VENDOR_KEY
const lastModifiedStart = "1990-01-17T06:30:00Z"
const lastModifiedEnd = "2099-01-17T06:30:00Z"
const pageNumber = 1
const pageSize = 20

const getMetrcInfoByDispensaryId = async (context, id) => {
    return context.prisma.dispensary.findUnique({
        where: { id: id || undefined },
        select: {
            metrcConnectionStatus: true,
            metrcApiKey: true,
            cannabisLicense: true,
            id: true
        },
    })
}

export const getMetrcItemCategoryData = async (_args, context) => {

    const metrcInfo = await getMetrcInfoByDispensaryId(context, _args.input.dispensaryId)
    const metrcApiKey = metrcInfo.metrcApiKey
    const cannabisLicense = metrcInfo.cannabisLicense
    console.log("Metrc >>>", metrcApiEndpoint + 'items/v2/categories?licenseNumber=' + cannabisLicense)
    const response = await fetch(metrcApiEndpoint + 'items/v2/categories?licenseNumber=' + cannabisLicense, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Basic ' + base64encode(vendor_key + ":" + metrcApiKey)
        }
    });
    const jsonData = await response.json()
    const metrcCategoryData = jsonData.Data

    // const metrcDataInput = await metrcCategoryData.map(data => ({
    //     ...data,
    //     dispensaryId: _args.input.dispensaryId
    // }));

    const metrcDataInput = await metrcCategoryData.map( metrcCategory => {
        return {
            dispensaryId: _args.input.dispensaryId,
            Name: metrcCategory.Name,
            ProductCategoryType: metrcCategory.ProductCategoryType,
            QuantityType: metrcCategory.QuantityType,
            RequiresStrain: metrcCategory.RequiresStrain,
            RequiresItemBrand: metrcCategory.RequiresItemBrand,
            RequiresAdministrationMethod: metrcCategory.RequiresAdministrationMethod,
            RequiresUnitCbdPercent: metrcCategory.RequiresUnitCbdPercent,
            RequiresUnitCbdContent: metrcCategory.RequiresUnitCbdContent,
            RequiresUnitCbdContentDose: metrcCategory.RequiresUnitCbdContentDose,
            RequiresUnitThcPercent: metrcCategory.RequiresUnitThcPercent,
            RequiresUnitThcContent: metrcCategory.RequiresUnitThcContent,
            RequiresUnitThcContentDose: metrcCategory.RequiresUnitThcContentDose,
            RequiresUnitVolume: metrcCategory.RequiresUnitVolume,
            RequiresUnitWeight: metrcCategory.RequiresUnitWeight,
            RequiresServingSize: metrcCategory.RequiresServingSize,
            RequiresSupplyDurationDays: metrcCategory.RequiresSupplyDurationDays,
            RequiresNumberOfDoses: metrcCategory.RequiresNumberOfDoses,
            RequiresPublicIngredients: metrcCategory.RequiresPublicIngredients,
            RequiresDescription: metrcCategory.RequiresDescription,
            RequiresAllergens: metrcCategory.RequiresAllergens,
            RequiresProductPhotos: metrcCategory.RequiresProductPhotos,
            RequiresProductPhotoDescription: metrcCategory.RequiresProductPhotoDescription,
            RequiresLabelPhotos: metrcCategory.RequiresLabelPhotos,
            RequiresLabelPhotoDescription: metrcCategory.RequiresLabelPhotoDescription,
            RequiresPackagingPhotos: metrcCategory.RequiresPackagingPhotos,
            RequiresPackagingPhotoDescription: metrcCategory.RequiresPackagingPhotoDescription,
            CanContainSeeds: metrcCategory.CanContainSeeds,
            CanBeRemediated: metrcCategory.CanBeRemediated,
            CanBeDecontaminated: metrcCategory.CanBeDecontaminated,
            CanBeDestroyed: metrcCategory.CanBeDestroyed,
            RequiresProductPDFDocuments: metrcCategory.RequiresProductPDFDocuments,
            LabTestBatchNames: metrcCategory.LabTestBatchNames,
        }
    })

    return metrcDataInput
}

export const getMetrcActivePackageDataByParams = async (metrcApiKey, cannabisLicense, pageNumber, pageSize) => {

    console.log("Metrc >>>", metrcApiEndpoint + 'packages/v2/active?licenseNumber=' + cannabisLicense + '&lastModifiedStart=' + lastModifiedStart + '&lastModifiedEnd=' + lastModifiedEnd + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize)

    const response = await fetch(metrcApiEndpoint + 'packages/v2/active?licenseNumber=' + cannabisLicense + '&lastModifiedStart=' + lastModifiedStart + '&lastModifiedEnd=' + lastModifiedEnd + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Basic ' + base64encode(vendor_key + ":" + metrcApiKey)
        }
    });
    const jsonData = await response.json()
    return jsonData
}

export const getMetrcInactivePackageDataByParams = async (metrcApiKey, cannabisLicense, pageNumber, pageSize) => {

    console.log("Metrc >>>", metrcApiEndpoint + 'packages/v2/inactive?licenseNumber=' + cannabisLicense + '&lastModifiedStart=' + lastModifiedStart + '&lastModifiedEnd=' + lastModifiedEnd + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize)

    const response = await fetch(metrcApiEndpoint + 'packages/v2/inactive?licenseNumber=' + cannabisLicense + '&lastModifiedStart=' + lastModifiedStart + '&lastModifiedEnd=' + lastModifiedEnd + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Basic ' + base64encode(vendor_key + ":" + metrcApiKey)
        }
    });
    const jsonData = await response.json()
    return jsonData
}

export const getMetrcDeliveryPackagesByParams = async (metrcApiKey, cannabisLicense, deliveryId, pageNumber, pageSize) => {

    console.log("Metrc >>>", metrcApiEndpoint + 'transfers/v2/deliveries/' + deliveryId + '/packages')

    const response = await fetch(metrcApiEndpoint + 'transfers/v2/deliveries/' + deliveryId + '/packages', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Basic ' + base64encode(vendor_key + ":" + metrcApiKey)
        }
    });
    console.log("response>>>>>>", response.status)
    if (response.status !== 200) return 'failed'
    const jsonData = await response.json()
    return jsonData
}

export const getMetrcIncomingTransferDataByParams = async (metrcApiKey, cannabisLicense, pageNumber, pageSize) => {

    console.log("Metrc >>>", metrcApiEndpoint + 'transfers/v2/incoming?licenseNumber=' + cannabisLicense + '&lastModifiedStart=' + lastModifiedStart + '&lastModifiedEnd=' + lastModifiedEnd + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize)

    const response = await fetch(metrcApiEndpoint + 'transfers/v2/incoming?licenseNumber=' + cannabisLicense + '&lastModifiedStart=' + lastModifiedStart + '&lastModifiedEnd=' + lastModifiedEnd + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Basic ' + base64encode(vendor_key + ":" + metrcApiKey)
        }
    });
    const jsonData = await response.json()
    return jsonData
}

export const getMetrcActivePackageData = async (_args, context) => {
    let packageData: any[] = []
    let onePageData: any
    const metrcInfo = await getMetrcInfoByDispensaryId(context, _args.input.dispensaryId)
    const metrcApiKey = metrcInfo.metrcApiKey
    const cannabisLicense = metrcInfo.cannabisLicense
    const jsonData = await getMetrcActivePackageDataByParams(metrcApiKey, cannabisLicense, 1, 20)
    console.log("jsonData>> ", jsonData)
    for (let i = 1; i <= jsonData.TotalPages; i++) {
        onePageData = await getMetrcActivePackageDataByParams(metrcApiKey, cannabisLicense, i, 20)
        packageData.push(onePageData.Data)
    }
    packageData = packageData.flat()

    const metrcDataInput = packageData.map(packageRecord => {
        const item = packageRecord.Item; // Assuming Item is a property of package

        return {
            dispensaryId: _args.input.dispensaryId,
            packageId: packageRecord.Id,
            packageStatus: PackageStatus.PENDING,
            productId: null,
            cost: 0,
            isConnectedWithProduct: false,
            originalQty: packageRecord.Quantity,
            Quantity: packageRecord.Quantity,
            packageLabel: packageRecord.Label,
            SourceHarvestCount: packageRecord.SourceHarvestCount,
            SourcePackageCount: packageRecord.SourcePackageCount,
            SourceProcessingJobCount: packageRecord.SourceProcessingJobCount,
            SourceHarvestNames: packageRecord.SourceHarvestNames,
            SourcePackageLabels: packageRecord.SourcePackageLabels,
            LocationId: packageRecord.LocationId,
            LocationName: packageRecord.LocationName,
            LocationTypeName: packageRecord.LocationTypeName,
            UnitOfMeasureName: packageRecord.UnitOfMeasureName,
            UnitOfMeasureAbbreviation: packageRecord.UnitOfMeasureAbbreviation,
            PatientLicenseNumber: packageRecord.PatientLicenseNumber,
            ItemFromFacilityLicenseNumber: packageRecord.ItemFromFacilityLicenseNumber,
            ItemFromFacilityName: packageRecord.ItemFromFacilityName,
            Note: packageRecord.Note,
            PackagedDate: packageRecord.PackagedDate,
            ExpirationDate: packageRecord.ExpirationDate,
            SellByDate: packageRecord.SellByDate,
            UseByDate: packageRecord.UseByDate,
            InitialLabTestingState: packageRecord.InitialLabTestingState,
            LabTestingState: packageRecord.LabTestingState,
            LabTestingStateDate: packageRecord.LabTestingStateDate,
            LabTestingPerformedDate: packageRecord.LabTestingPerformedDate,
            LabTestResultExpirationDateTime: packageRecord.LabTestResultExpirationDateTime,
            LabTestingRecordedDate: packageRecord.LabTestingRecordedDate,
            IsProductionBatch: packageRecord.IsProductionBatch,
            ProductionBatchNumber: packageRecord.ProductionBatchNumber,
            SourceProductionBatchNumbers: packageRecord.SourceProductionBatchNumbers,
            IsTradeSample: packageRecord.IsTradeSample,
            IsTradeSamplePersistent: packageRecord.IsTradeSamplePersistent,
            SourcePackageIsTradeSample: packageRecord.SourcePackageIsTradeSample,
            IsDonation: packageRecord.IsDonation,
            IsDonationPersistent: packageRecord.IsDonationPersistent,
            SourcePackageIsDonation: packageRecord.SourcePackageIsDonation,
            IsTestingSample: packageRecord.IsTestingSample,
            IsProcessValidationTestingSample: packageRecord.IsProcessValidationTestingSample,
            ProductRequiresRemediation: packageRecord.ProductRequiresRemediation,
            ContainsRemediatedProduct: packageRecord.ContainsRemediatedProduct,
            RemediationDate: packageRecord.RemediationDate,
            ProductRequiresDecontamination: packageRecord.ProductRequiresDecontamination,
            ContainsDecontaminatedProduct: packageRecord.ContainsDecontaminatedProduct,
            DecontaminationDate: packageRecord.DecontaminationDate,
            ReceivedDateTime: packageRecord.ReceivedDateTime,
            ReceivedFromManifestNumber: packageRecord.ReceivedFromManifestNumber,
            ReceivedFromFacilityLicenseNumber: packageRecord.ReceivedFromFacilityLicenseNumber,
            ReceivedFromFacilityName: packageRecord.ReceivedFromFacilityName,
            IsOnHold: packageRecord.IsOnHold,
            IsOnRecall: packageRecord.IsOnRecall,
            ArchivedDate: packageRecord.ArchivedDate,
            IsFinished: packageRecord.IsFinished,
            FinishedDate: packageRecord.FinishedDate,
            IsOnTrip: packageRecord.IsOnTrip,
            IsOnRetailerDelivery: packageRecord.IsOnRetailerDelivery,
            PackageForProductDestruction: packageRecord.PackageForProductDestruction,
            LastModified: packageRecord.LastModified,
            RetailIdQrCount: packageRecord.RetailIdQrCount,
            itemId: item?.Id,
            itemName: item?.Name,
            itemProductCategoryName: item?.ProductCategoryName,
            itemProductCategoryType: item?.ProductCategoryType,
            itemIsExpirationDateRequired: item?.IsExpirationDateRequired,
            itemHasExpirationDate: item?.HasExpirationDate,
            itemIsSellByDateRequired: item?.IsSellByDateRequired,
            itemHasSellByDate: item?.HasSellByDate,
            itemIsUseByDateRequired: item?.IsUseByDateRequired,
            itemHasUseByDate: item?.HasUseByDate,
            itemQuantityType: item?.QuantityType,
            itemDefaultLabTestingState: item?.DefaultLabTestingState,
            itemUnitOfMeasureName: item?.UnitOfMeasureName,
            itemApprovalStatus: item?.ApprovalStatus,
            itemApprovalStatusDateTime: item?.ApprovalStatusDateTime,
            itemStrainId: item?.StrainId,
            itemStrainName: item?.StrainName,
            itemItemBrandId: item?.ItemBrandId,
            itemItemBrandName: item?.ItemBrandName,
            itemAdministrationMethod: item?.AdministrationMethod,
            itemUnitCbdPercent: item?.UnitCbdPercent,
            itemUnitCbdContent: item?.UnitCbdContent,
            itemUnitCbdContentUnitOfMeasureName: item?.UnitCbdContentUnitOfMeasureName,
            itemUnitCbdContentDose: item?.UnitCbdContentDose,
            itemUnitCbdContentDoseUnitOfMeasureName: item?.UnitCbdContentDoseUnitOfMeasureName,
            itemUnitThcPercent: item?.UnitThcPercent,
            itemUnitThcContent: item?.UnitThcContent,
            itemUnitThcContentUnitOfMeasureName: item?.UnitThcContentUnitOfMeasureName,
            itemUnitThcContentDose: item?.UnitThcContentDose,
            itemUnitThcContentDoseUnitOfMeasureId: item?.UnitThcContentDoseUnitOfMeasureId,
            itemUnitThcContentDoseUnitOfMeasureName: item?.UnitThcContentDoseUnitOfMeasureName,
            itemUnitVolume: item?.UnitVolume,
            itemUnitVolumeUnitOfMeasureName: item?.UnitVolumeUnitOfMeasureName,
            itemUnitWeight: item?.UnitWeight,
            itemUnitWeightUnitOfMeasureName: item?.UnitWeightUnitOfMeasureName,
            itemServingSize: item?.ServingSize,
            itemNumberOfDoses: item?.NumberOfDoses,
            itemUnitQuantity: item?.UnitQuantity,
            itemUnitQuantityUnitOfMeasureName: item?.UnitQuantityUnitOfMeasureName,
            itemPublicIngredients: item?.PublicIngredients,
            itemDescription: item?.Description,
            itemAllergens: item?.Allergens,
            itemProductImages: item?.ProductImages,
            itemProductPhotoDescription: item?.ProductPhotoDescription,
            itemLabelImages: item?.LabelImages,
            itemLabelPhotoDescription: item?.LabelPhotoDescription,
            itemPackagingImages: item?.PackagingImages,
            itemPackagingPhotoDescription: item?.PackagingPhotoDescription,
            itemProductPDFDocuments: item?.ProductPDFDocuments,
            itemIsUsed: item?.IsUsed,
            itemLabTestBatchNames: item?.LabTestBatchNames,
            itemProcessingJobCategoryName: item?.ProcessingJobCategoryName,
            itemProductBrandName: item?.ProductBrandName,
        };
    });
    return metrcDataInput
}
export const getMetrcInactivePackageData = async (_args, context) => {
    let packageData: any[] = []
    let onePageData: any
    const metrcInfo = await getMetrcInfoByDispensaryId(context, _args.input.dispensaryId)
    const metrcApiKey = metrcInfo.metrcApiKey
    const cannabisLicense = metrcInfo.cannabisLicense
    const jsonData = await getMetrcInactivePackageDataByParams(metrcApiKey, cannabisLicense, 1, 20)
    console.log("jsonData>> ", jsonData)
    for (let i = 1; i <= jsonData.TotalPages; i++) {
        onePageData = await getMetrcInactivePackageDataByParams(metrcApiKey, cannabisLicense, i, 20)
        packageData.push(onePageData.Data)
    }
    packageData = packageData.flat()

    const metrcDataInput = packageData.map(packageRecord => {
        const item = packageRecord.Item; // Assuming Item is a property of package

        return {
            dispensaryId: _args.input.dispensaryId,
            packageId: packageRecord.Id,
            packageStatus: PackageStatus.PENDING,
            productId: null,
            cost: 0,
            isConnectedWithProduct: false,
            originalQty: packageRecord.Quantity,
            Quantity: packageRecord.Quantity,
            packageLabel: packageRecord.Label,
            SourceHarvestCount: packageRecord.SourceHarvestCount,
            SourcePackageCount: packageRecord.SourcePackageCount,
            SourceProcessingJobCount: packageRecord.SourceProcessingJobCount,
            SourceHarvestNames: packageRecord.SourceHarvestNames,
            SourcePackageLabels: packageRecord.SourcePackageLabels,
            LocationId: packageRecord.LocationId,
            LocationName: packageRecord.LocationName,
            LocationTypeName: packageRecord.LocationTypeName,
            UnitOfMeasureName: packageRecord.UnitOfMeasureName,
            UnitOfMeasureAbbreviation: packageRecord.UnitOfMeasureAbbreviation,
            PatientLicenseNumber: packageRecord.PatientLicenseNumber,
            ItemFromFacilityLicenseNumber: packageRecord.ItemFromFacilityLicenseNumber,
            ItemFromFacilityName: packageRecord.ItemFromFacilityName,
            Note: packageRecord.Note,
            PackagedDate: packageRecord.PackagedDate,
            ExpirationDate: packageRecord.ExpirationDate,
            SellByDate: packageRecord.SellByDate,
            UseByDate: packageRecord.UseByDate,
            InitialLabTestingState: packageRecord.InitialLabTestingState,
            LabTestingState: packageRecord.LabTestingState,
            LabTestingStateDate: packageRecord.LabTestingStateDate,
            LabTestingPerformedDate: packageRecord.LabTestingPerformedDate,
            LabTestResultExpirationDateTime: packageRecord.LabTestResultExpirationDateTime,
            LabTestingRecordedDate: packageRecord.LabTestingRecordedDate,
            IsProductionBatch: packageRecord.IsProductionBatch,
            ProductionBatchNumber: packageRecord.ProductionBatchNumber,
            SourceProductionBatchNumbers: packageRecord.SourceProductionBatchNumbers,
            IsTradeSample: packageRecord.IsTradeSample,
            IsTradeSamplePersistent: packageRecord.IsTradeSamplePersistent,
            SourcePackageIsTradeSample: packageRecord.SourcePackageIsTradeSample,
            IsDonation: packageRecord.IsDonation,
            IsDonationPersistent: packageRecord.IsDonationPersistent,
            SourcePackageIsDonation: packageRecord.SourcePackageIsDonation,
            IsTestingSample: packageRecord.IsTestingSample,
            IsProcessValidationTestingSample: packageRecord.IsProcessValidationTestingSample,
            ProductRequiresRemediation: packageRecord.ProductRequiresRemediation,
            ContainsRemediatedProduct: packageRecord.ContainsRemediatedProduct,
            RemediationDate: packageRecord.RemediationDate,
            ProductRequiresDecontamination: packageRecord.ProductRequiresDecontamination,
            ContainsDecontaminatedProduct: packageRecord.ContainsDecontaminatedProduct,
            DecontaminationDate: packageRecord.DecontaminationDate,
            ReceivedDateTime: packageRecord.ReceivedDateTime,
            ReceivedFromManifestNumber: packageRecord.ReceivedFromManifestNumber,
            ReceivedFromFacilityLicenseNumber: packageRecord.ReceivedFromFacilityLicenseNumber,
            ReceivedFromFacilityName: packageRecord.ReceivedFromFacilityName,
            IsOnHold: packageRecord.IsOnHold,
            IsOnRecall: packageRecord.IsOnRecall,
            ArchivedDate: packageRecord.ArchivedDate,
            IsFinished: packageRecord.IsFinished,
            FinishedDate: packageRecord.FinishedDate,
            IsOnTrip: packageRecord.IsOnTrip,
            IsOnRetailerDelivery: packageRecord.IsOnRetailerDelivery,
            PackageForProductDestruction: packageRecord.PackageForProductDestruction,
            LastModified: packageRecord.LastModified,
            RetailIdQrCount: packageRecord.RetailIdQrCount,
            itemId: item?.Id,
            itemName: item?.Name,
            itemProductCategoryName: item?.ProductCategoryName,
            itemProductCategoryType: item?.ProductCategoryType,
            itemIsExpirationDateRequired: item?.IsExpirationDateRequired,
            itemHasExpirationDate: item?.HasExpirationDate,
            itemIsSellByDateRequired: item?.IsSellByDateRequired,
            itemHasSellByDate: item?.HasSellByDate,
            itemIsUseByDateRequired: item?.IsUseByDateRequired,
            itemHasUseByDate: item?.HasUseByDate,
            itemQuantityType: item?.QuantityType,
            itemDefaultLabTestingState: item?.DefaultLabTestingState,
            itemUnitOfMeasureName: item?.UnitOfMeasureName,
            itemApprovalStatus: item?.ApprovalStatus,
            itemApprovalStatusDateTime: item?.ApprovalStatusDateTime,
            itemStrainId: item?.StrainId,
            itemStrainName: item?.StrainName,
            itemItemBrandId: item?.ItemBrandId,
            itemItemBrandName: item?.ItemBrandName,
            itemAdministrationMethod: item?.AdministrationMethod,
            itemUnitCbdPercent: item?.UnitCbdPercent,
            itemUnitCbdContent: item?.UnitCbdContent,
            itemUnitCbdContentUnitOfMeasureName: item?.UnitCbdContentUnitOfMeasureName,
            itemUnitCbdContentDose: item?.UnitCbdContentDose,
            itemUnitCbdContentDoseUnitOfMeasureName: item?.UnitCbdContentDoseUnitOfMeasureName,
            itemUnitThcPercent: item?.UnitThcPercent,
            itemUnitThcContent: item?.UnitThcContent,
            itemUnitThcContentUnitOfMeasureName: item?.UnitThcContentUnitOfMeasureName,
            itemUnitThcContentDose: item?.UnitThcContentDose,
            itemUnitThcContentDoseUnitOfMeasureId: item?.UnitThcContentDoseUnitOfMeasureId,
            itemUnitThcContentDoseUnitOfMeasureName: item?.UnitThcContentDoseUnitOfMeasureName,
            itemUnitVolume: item?.UnitVolume,
            itemUnitVolumeUnitOfMeasureName: item?.UnitVolumeUnitOfMeasureName,
            itemUnitWeight: item?.UnitWeight,
            itemUnitWeightUnitOfMeasureName: item?.UnitWeightUnitOfMeasureName,
            itemServingSize: item?.ServingSize,
            itemNumberOfDoses: item?.NumberOfDoses,
            itemUnitQuantity: item?.UnitQuantity,
            itemUnitQuantityUnitOfMeasureName: item?.UnitQuantityUnitOfMeasureName,
            itemPublicIngredients: item?.PublicIngredients,
            itemDescription: item?.Description,
            itemAllergens: item?.Allergens,
            itemProductImages: item?.ProductImages,
            itemProductPhotoDescription: item?.ProductPhotoDescription,
            itemLabelImages: item?.LabelImages,
            itemLabelPhotoDescription: item?.LabelPhotoDescription,
            itemPackagingImages: item?.PackagingImages,
            itemPackagingPhotoDescription: item?.PackagingPhotoDescription,
            itemProductPDFDocuments: item?.ProductPDFDocuments,
            itemIsUsed: item?.IsUsed,
            itemLabTestBatchNames: item?.LabTestBatchNames,
            itemProcessingJobCategoryName: item?.ProcessingJobCategoryName,
            itemProductBrandName: item?.ProductBrandName,
        };
    });
    return metrcDataInput
}

export const getMetrcDeliveryPackagesByDeliveryId = async (_args, context, deliveryId) => {
    let packageData: any[] = []
    let onePageData: any
    const metrcInfo = await getMetrcInfoByDispensaryId(context, _args.input.dispensaryId)
    const metrcApiKey = metrcInfo.metrcApiKey
    const cannabisLicense = metrcInfo.cannabisLicense
    const jsonData = await getMetrcDeliveryPackagesByParams(metrcApiKey, cannabisLicense, deliveryId, 1, 20)
    // packageData.push(jsonData.Data)
    for (let i = 1; i <= jsonData.TotalPages; i++) {
        onePageData = await getMetrcDeliveryPackagesByParams(metrcApiKey, cannabisLicense, deliveryId, i, 20)
        if (onePageData === 'failed') continue
        packageData.push(onePageData.Data)
    }
    packageData = packageData.flat()
    const metrcDataInput = packageData.map(({ PackageId, PackageLabel, ShipmentPackageState, ShippedQuantity, ShippedUnitOfMeasureName, ReceivedQuantity, ReceivedUnitOfMeasureName, ...data }) => ({
        dispensaryId: _args.input.dispensaryId,
        deliveryId: deliveryId,
        packageId: PackageId,
        packageLabel: PackageLabel,
        ShipmentPackageState: ShipmentPackageState,
        ShippedQuantity: ShippedQuantity,
        ShippedUnitOfMeasureName: ShippedUnitOfMeasureName,
        ReceivedQuantity: ReceivedQuantity,
        ReceivedUnitOfMeasureName: ReceivedUnitOfMeasureName,
    }));
    // console.log("metrcDataInput", metrcDataInput)

    return metrcDataInput
}

export const getMetrcDeliveryPackages = async (_args, context) => {
    let packageData: any[] = []
    let onePageData: any

    const savedPackages = await context.prisma.package.findMany({
        select: {
            packageId: true
        },
        where: { dispensaryId: _args.input.dispensaryId },
    })

    const transfers = await context.prisma.transfer.findMany({
        where: { dispensaryId: _args.input.dispensaryId },
    })

    for (let i = 0; i < transfers.length; i++) {
        console.log("number>>> ", i)
        onePageData = await getMetrcDeliveryPackagesByDeliveryId(_args, context, transfers[i].deliveryId)
        packageData.push(onePageData)
    }

    packageData = packageData.flat()
    console.log("packageData>>>", packageData)
    const filterArray = savedPackages.map(b => b.packageId)
    const packageDataResult = packageData.filter(a => filterArray.includes(a.packageId))

    return packageDataResult
}

export const getMetrcIncomingTransfer = async (_args, context) => {
    let transferData: any[] = []
    let onePageData: any
    const metrcInfo = await getMetrcInfoByDispensaryId(context, _args.input.dispensaryId)
    const metrcApiKey = metrcInfo.metrcApiKey
    const cannabisLicense = metrcInfo.cannabisLicense
    const jsonData = await getMetrcIncomingTransferDataByParams(metrcApiKey, cannabisLicense, 1, 20)

    for (let i = 1; i <= jsonData.TotalPages; i++) {
        onePageData = await getMetrcIncomingTransferDataByParams(metrcApiKey, cannabisLicense, i, 20)
        transferData.push(onePageData.Data)
    }
    transferData = transferData.flat()

    const metrcDataInput = transferData.map(({
        Id,
        DeliveryId,
        PackageCount,
        ReceivedPackageCount,
        CreatedDateTime,
        ReceivedDateTime,
        ShipperFacilityLicenseNumber,
        ShipperFacilityName,
        ...data
    }) => ({
        dispensaryId: _args.input.dispensaryId,
        userId: _args.input.userId,
        transferType: TransferType.Incoming,
        isMJ: true,
        status: PackageStatus.PENDING,
        transferId: Id,
        deliveryId: DeliveryId,
        PackageCount: PackageCount,
        ReceivedPackageCount: ReceivedPackageCount,
        CreatedDateTime: CreatedDateTime,
        ReceivedDateTime: ReceivedDateTime,
        ShipperFacilityLicenseNumber: ShipperFacilityLicenseNumber,
        ShipperFacilityName: ShipperFacilityName,
    }));
    return metrcDataInput
}
