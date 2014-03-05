#Put the bank download (as bk_download.csv) in the rails root path then just run "ruby csv_extract.rb"
require 'csv'

extract

def extract
	puts "STARTING EXTRACT OF #{@file}"

	csv = CSV.open("#{Rails.root}/bk_download.csv")

	csv.each_with_index do |row, i|
		if row.blank?
			puts "\n\t\tSkipping row #{i} because it's blank\n\n\n"
			next
		end

		puts "---------- Saving row #{i} ------------------------------"

		cleared = (row[0] == 'posted') ? true : false
		date = Date.strptime(row[2], '%m/%d/%Y')
		ledger_month = Date.strptime(row[2], '%m/%d/%Y').strftime('%Y-%m-01')
		deposit = (row[6].to_d > 0.00) ? true : false
		amount = row[6].sub('-', '').to_d

		vendor = row[4]
		category = row[5]

		vendor = humanize_phrase(row[4])
		category = humanize_phrase(row[5])

		params = {vendor_name: vendor, category_name: category}

		puts "deposit: #{deposit}, cleared: #{cleared}, date: #{date}, ledger_month: #{ledger_month}, vendor: #{vendor}, category: #{category}, amount: #{amount}"

		t = Transaction.new
		t.date = date
		t.amount = amount
		t.cleared = cleared
		t.recurring = false
		t.ledger_month = ledger_month
		t.deposit = deposit

		t.save
		t.save_all(params)

		puts "----------- Save Successful -----------------------------\n\n"
	end
end

# Removes all the weird formatting from the bank csv download and then capitalizes each word.
def humanize_phrase(phrase)
	phrase = "#{phrase.split('   ')[0].split('#')[0].split('- ')[0].split('**')[0].split('~')[0]}"
	phrase.downcase.split.map(&:capitalize).join(' ')
end