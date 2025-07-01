import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Voucher } from '@/types/voucher';
import { getAllVouchers } from '@/api/modules/voucher';
import { useAuth } from '@/providers/AuthenticatedProvider';
import BackgroundLoading2 from '@/components/loading/background_2';
import { useTranslation } from 'react-i18next';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredVouchers, setFilteredVouchers] = useState(vouchers);
  const { info } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    filterVouchers();
  }, [searchText, vouchers]);

  const onLoad = async () => {
    setLoading(true);
    const vouchers = await getAllVouchers(info?.id ?? "");
    setTimeout(() => {
      setVouchers(vouchers);
      setLoading(false);
    }, 500);
  }

  useEffect(() => {
    if (info) onLoad();
  }, [info]);

  const filterVouchers = () => {
    const filtered = vouchers.filter(voucher =>
      voucher.code.toLowerCase().includes(searchText.toLowerCase()) ||
      voucher.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredVouchers(filtered);
  };

  const deleteVoucher = (id: any) => {
    Alert.alert(
      'Delete Voucher',
      'Are you sure you want to delete this voucher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setVouchers(vouchers.filter(v => v.id !== id))
        }
      ]
    );
  };

  const renderVoucherItem = ({ item }: any) => {
    const isExpired = new Date(item.expiryDate) < new Date();

    return (
      <View style={[styles.voucherCard, !item.isActive && styles.inactiveCard]}>
        <View style={styles.voucherHeader}>
          <View style={styles.voucherInfo}>
            <Text style={styles.voucherCode}>{item.code}</Text>
            <Text style={styles.voucherTitle}>{item.title}</Text>
            <Text style={styles.voucherDesc}>{item.description}</Text>
          </View>
          <View style={styles.voucherActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteVoucher(item.id)}
            >
              <Ionicons name="trash" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.voucherDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("app.discount")}:</Text>
            <Text style={styles.detailValue}>
              {item.type === 'percentage' ? `${item.discount}%` : `$${item.discount}`}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("app.order_min")}:</Text>
            <Text style={styles.detailValue}>${item.minAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("app.expire_at")}:</Text>
            <Text style={[styles.detailValue, isExpired && styles.expiredText]}>
              {item.expiryDate}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("app.voucher")}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onLoad}>
          <Ionicons name="reload" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("app.search")}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredVouchers}
        renderItem={renderVoucherItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {loading && <BackgroundLoading2 />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingTop: 32
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: 40
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  voucherCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveCard: {
    opacity: 0.7,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  voucherDesc: {
    fontSize: 14,
    color: '#8E8E93',
  },
  voucherActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  voucherDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  expiredText: {
    color: '#FF3B30',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
  },
  inactiveBadge: {
    backgroundColor: '#F5F5F5',
  },
  expiredBadge: {
    backgroundColor: '#FFE8E8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#34C759',
  },
  inactiveText: {
    color: '#8E8E93',
  },
  expiredStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeType: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTypeText: {
    color: 'white',
  },
});

export default VoucherManagement;