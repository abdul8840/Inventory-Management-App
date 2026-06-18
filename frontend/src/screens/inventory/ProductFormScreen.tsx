import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Menu, Text, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../components/common/AppButton';
import { paperIcon } from '../../components/common/PaperIcon';
import { Screen } from '../../components/common/Screen';
import { categoryOptions } from '../../constants/categories';
import { useCreateProduct, useProduct, useUpdateProduct } from '../../features/inventory/useProducts';
import { uploadSelectedProductImage } from '../../services/imageUpload';
import { palette } from '../../theme/theme';
import type { InventoryStackParamList } from '../../types/navigation';
import type { Product, ProductCategory, ProductFormValues, ProductStatus } from '../../types/product';
import { calculateDraftMetrics } from '../../utils/productCalculations';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { productFormSchema } from '../../utils/validation';

type Props = NativeStackScreenProps<InventoryStackParamList, 'ProductForm'>;

const statuses: ProductStatus[] = ['active', 'inactive', 'out_of_stock', 'discontinued'];

const defaults: ProductFormValues = {
  title: '',
  description: '',
  sku: '',
  barcode: '',
  qrCode: '',
  category: 'Others',
  images: [],
  stockAvailable: 0,
  stockSold: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  lowStockAlertThreshold: 5,
  supplierName: '',
  supplierContact: '',
  status: 'active',
  notes: ''
};

export function ProductFormScreen({ route, navigation }: Props) {
  const productId = route.params?.productId;
  const barcode = route.params?.barcode;
  const theme = useTheme();
  const productQuery = useProduct(productId);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(productId || '');
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...defaults, barcode: barcode || '' }
  });
  const values = form.watch();
  const metrics = calculateDraftMetrics(values);

  useEffect(() => {
    if (productQuery.data) {
      form.reset(toProductFormValues(productQuery.data));
    }
  }, [form, productQuery.data]);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 5 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    try {
      const image = await uploadSelectedProductImage(asset);
      form.setValue('images', [...form.getValues('images'), { ...image, isPrimary: form.getValues('images').length === 0 }], { shouldDirty: true });
    } catch (error) {
      Alert.alert('Upload failed', error instanceof Error ? error.message : 'Unable to upload image.');
    }
  };

  const onSubmit = (payload: ProductFormValues) => {
    if (productId) {
      updateMutation.mutate(payload, { onSuccess: () => navigation.goBack() });
      return;
    }

    createMutation.mutate(payload, { onSuccess: (product) => navigation.replace('ProductDetails', { productId: product._id }) });
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Screen>
      <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 24, padding: 18, marginBottom: 18 }}>
        <Text variant="labelLarge" style={{ color: '#F5D8DC', fontWeight: '800' }}>
          Product studio
        </Text>
        <Text variant="headlineSmall" style={{ color: '#FFFFFF', fontWeight: '900', marginTop: 4 }}>
          {productId ? 'Edit Product' : 'New Product'}
        </Text>
        <Text variant="bodyMedium" style={{ color: '#F5D8DC', marginTop: 6 }}>
          Images, stock, pricing, supplier, and alert settings.
        </Text>
      </View>
      <View className="gap-3">
        <ControlledInput control={form.control} name="title" label="Product Title" />
        <ControlledInput control={form.control} name="description" label="Description" multiline />
        <ControlledInput control={form.control} name="sku" label="SKU (auto generated if empty)" autoCapitalize="characters" />
        <ControlledInput control={form.control} name="barcode" label="Barcode" />
        <ControlledInput control={form.control} name="qrCode" label="QR Code" />
        <SelectField<ProductCategory>
          label="Category"
          value={values.category}
          options={categoryOptions}
          onChange={(value) => form.setValue('category', value, { shouldDirty: true })}
        />
        <SelectField<ProductStatus>
          label="Product Status"
          value={values.status}
          options={statuses.map((status) => ({ label: status.replace(/_/g, ' '), value: status }))}
          onChange={(value) => form.setValue('status', value, { shouldDirty: true })}
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ControlledInput control={form.control} name="stockAvailable" label="Stock Available" keyboardType="number-pad" />
          </View>
          <View className="flex-1">
            <ControlledInput control={form.control} name="stockSold" label="Stock Sold" keyboardType="number-pad" />
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ControlledInput control={form.control} name="purchasePrice" label="Purchase Price" keyboardType="decimal-pad" />
          </View>
          <View className="flex-1">
            <ControlledInput control={form.control} name="sellingPrice" label="Selling Price" keyboardType="decimal-pad" />
          </View>
        </View>
        <ControlledInput control={form.control} name="lowStockAlertThreshold" label="Low Stock Alert Threshold" keyboardType="number-pad" />
        <ControlledInput control={form.control} name="supplierName" label="Supplier Name" />
        <ControlledInput control={form.control} name="supplierContact" label="Supplier Contact" />
        <ControlledInput control={form.control} name="notes" label="Notes" multiline />
        <View
          style={{
            borderRadius: 20,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            padding: 16
          }}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
            Calculations
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <Metric label="Total stock" value={formatNumber(metrics.totalStock)} />
            <Metric label="Purchase value" value={formatCurrency(metrics.totalPurchaseValue)} />
            <Metric label="Sales value" value={formatCurrency(metrics.totalSalesValue)} />
            <Metric label="Profit" value={`${formatCurrency(metrics.profitAmount)} / ${metrics.profitMargin.toFixed(1)}%`} accent />
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {values.images.map((image) => (
            <Image key={image.publicId} source={{ uri: image.url }} style={{ width: 72, height: 72, borderRadius: 8 }} />
          ))}
        </View>
        <Button mode="outlined" icon={paperIcon('image-plus')} onPress={pickImage}>
          Add Product Image
        </Button>
        <AppButton loading={loading} onPress={form.handleSubmit(onSubmit)}>
          {productId ? 'Save Changes' : 'Create Product'}
        </AppButton>
      </View>
    </Screen>
  );
}

function ControlledInput({ control, name, label, ...props }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <TextInput mode="outlined" label={label} value={String(field.value ?? '')} onBlur={field.onBlur} onChangeText={field.onChange} {...props} />
          <HelperText type="error" visible={Boolean(fieldState.error)}>
            {fieldState.error?.message}
          </HelperText>
        </>
      )}
    />
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<Button mode="outlined" onPress={() => setVisible(true)} contentStyle={{ minHeight: 50 }}>{label}: {String(value)}</Button>}
    >
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          title={option.label}
          onPress={() => {
            onChange(option.value);
            setVisible(false);
          }}
        />
      ))}
    </Menu>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={{ width: '48%', borderRadius: 14, backgroundColor: accent ? palette.redSoft : '#FFF8F0', padding: 10 }}>
      <Text variant="labelSmall" style={{ color: accent ? palette.redDark : palette.muted, fontWeight: '800' }}>
        {label}
      </Text>
      <Text variant="titleSmall" numberOfLines={1} adjustsFontSizeToFit style={{ color: accent ? palette.redDark : palette.black, fontWeight: '900' }}>
        {value}
      </Text>
    </View>
  );
}

function toProductFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    description: product.description,
    sku: product.sku,
    barcode: product.barcode,
    qrCode: product.qrCode,
    category: product.category,
    images: product.images,
    stockAvailable: product.stockAvailable,
    stockSold: product.stockSold,
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    lowStockAlertThreshold: product.lowStockAlertThreshold,
    supplierName: product.supplierName,
    supplierContact: product.supplierContact,
    status: product.status,
    notes: product.notes,
  };
}
